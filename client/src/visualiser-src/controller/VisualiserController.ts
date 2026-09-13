import { Timeline, Runner } from '@svgdotjs/svg.js';
import GraphicalDataStructure from '@/visualiser-src/common/GraphicalDataStructure';
import GraphicalDataStructureFactory from '@/visualiser-src/common/GraphicalDataStructureFactory';
import { Documentation } from '@/visualiser-src/common/typedefs';
import {
    type LinkedListHistoryV1,
    SNAPSHOT_SCHEMA_VERSION,
    SUPPORTED_RENDERER_VERSION,
    type LinkedListAlgorithmV1,
    type SnapshotV1,
} from '@/features/snapshots/snapshotTypes';
import {
  linkedListAlgorithmSchema,
  linkedListStateSchema,
  snapshotV1Schema,
} from '@/features/snapshots/snapshotDecoder';
import {
  MAX_HISTORY_OPERATIONS,
  MAX_LINKED_LIST_VALUES,
} from '@/features/snapshots/snapshotTypes';
import { topicToSnapshotStructureType } from '@/features/snapshots/snapshotTopicMap';
import { defaultSpeed } from '../common/constants';
import AnimationProducer from '../common/AnimationProducer';

interface TimeEvent extends Event {
    detail?: number;
}

type OperationArgument = number | number[];

type DataStructureOperation = (...args: OperationArgument[]) => AnimationProducer;

type OperationCapableDataStructure = GraphicalDataStructure &
    Partial<Record<string, DataStructureOperation>>;

const isLinkedListOperation = (command: string): command is LinkedListAlgorithmV1['name'] =>
    ['append', 'prepend', 'insert', 'search', 'delete'].includes(command);

class VisualiserController {
    private dataStructure?: GraphicalDataStructure;

    private topicTitle?: string;

    private currentTimeline: Timeline = new Timeline().persist(true);

    private timelineDuration: number = 0;

    private timestamps: number[] = [];

    private speed: number = 1;

    private isStepMode: boolean = false;

    private history: LinkedListHistoryV1 = {
        initialState: { values: [] },
        operations: [],
    };

    private startNewHistory(): void {
        this.history = {
            initialState: { values: [...this.data] },
            operations: [],
        };
    }

    public constructor(topicTitle?: string) {
        this.setSpeed(defaultSpeed);
        if (topicTitle !== undefined) {
            this.applyTopicTitle(topicTitle);
        }
    }

    // Return data in form of integer array
    public get data(): number[] {
        return this.dataStructure?.data || [];
    }

    // Return the current topic/data structure
    public get topic(): string | null {
        return this.topicTitle || null;
    }

    // Set data structure to loaded data
    public loadData(data: number[]): void {
        if (topicToSnapshotStructureType(this.topicTitle ?? '') === 'linked-list') {
            linkedListStateSchema.parse({ values: data });
        }
        this.resetDataStructure();
        this.dataStructure?.load([...data]);
        this.startNewHistory();
    }

    public getCurrentTimeline(): Timeline {
        return this.currentTimeline;
    }

    public constructTimeline(
        animationProducer: AnimationProducer,
        updateSlider: (val: number) => void
    ): void {
        this.resetTimeline(updateSlider);

        if (animationProducer.allRunners.length === 0) return;

        animationProducer.allRunners.forEach((runnerInfo) => {
            if (runnerInfo.runners.length === 0) return;
            runnerInfo.runners.forEach((runner) => {
                this.currentTimeline.schedule(runner, this.timelineDuration + 25, 'absolute');
            });
            const maxRunner = runnerInfo.runners.reduce(
                (prev: Runner, curr: Runner) => (prev.duration() < curr.duration() ? curr : prev),
                runnerInfo.runners[0]
            );
            this.timelineDuration += maxRunner.duration() + 25;
            if (runnerInfo.isTimestamped) {
                maxRunner.after(() => {
                    if (this.isStepMode) {
                        this.currentTimeline.pause();
                    }
                });
                this.timestamps.push(this.timelineDuration + 1);
            }
        });
        this.timestamps.push(this.timelineDuration);
        this.currentTimeline.play();
    }

    public resetTimeline(updateSlider: (val: number) => void) {
        this.currentTimeline = new Timeline().persist(true);
        this.currentTimeline.on('time', (evt: TimeEvent) => {
            // avoid division by 0
            if (this.timelineDuration !== 0 && evt.detail) {
                updateSlider((Math.min(evt.detail, this.timelineDuration) / this.timelineDuration) * 100);
            }
        });
        this.isStepMode = false;
        this.currentTimeline.speed(this.speed);
        this.timestamps = [];
        this.timelineDuration = 0;
    }

    public play(): void {
        this.isStepMode = false;
        this.currentTimeline.play();
    }

    public pause(): void {
        this.currentTimeline.pause();
    }

    public seekPercent(position: number): void {
        const timeSeek: number = (position * this.timelineDuration) / 100;
        this.currentTimeline.time(timeSeek);
        if (this.isStepMode) {
            this.pause();
            this.isStepMode = false;
        }
    }

    public setSpeed(speed: number): void {
        // we need to keep a member variable since
        // a new timeline is created for each animation sequence,
        // so the speed would be reset to 1
        this.speed = speed;

        // incase we are setting the speed without doing another operation
        this.currentTimeline.speed(this.speed);
    }

    // Finish playing the timeline
    public finish(): void {
        this.currentTimeline.finish();
    }

    public stepBackwards(): void {
        this.currentTimeline.time(this.computePrevTimestamp());
    }

    public stepForwards(): void {
        this.isStepMode = true;
        this.currentTimeline.play();
    }

    public applyTopicTitle(topicTitle: string) {
        this.currentTimeline.finish();
        this.currentTimeline.time(0);
        this.topicTitle = topicTitle;
        this.dataStructure = GraphicalDataStructureFactory.create(topicTitle);
        this.currentTimeline = new Timeline().persist(true);
        this.startNewHistory();
    }

    private getErrorMessageIfInvalidInput(command: string, args: string[]): string {
        if (!this.dataStructure) {
            return 'Invalid data structure';
        }
        const documentation = this.dataStructure.documentation;
        if (!Object.prototype.hasOwnProperty.call(documentation, command)) {
            return `Unsupported operation: ${command}`;
        }
        const expectedArgs = documentation[command].args;
        if (args.length !== expectedArgs.length) {
            return `Invalid arguments. Please provide ${args.join(', ')}`;
        }
        if (args.includes('') || (expectedArgs.length > 0 && args.some((arg) => !arg.match(/\d/)))) {
            return 'Argument(s) missing';
        }
        if (
            !args.every((value, idx) =>
                expectedArgs[idx].endsWith('s')
                    ? value
                            .split(/,| /g)
                            .filter((str) => str !== '')
                            .every((el) => /^\d+$/.test(el))
                    : /^\d+$/.test(value)
            )
        ) {
            return 'Argument(s) must be a positive integer';
        }
        let valueIndex = expectedArgs.indexOf('value');
        valueIndex = valueIndex === -1 ? expectedArgs.indexOf('values') : valueIndex;
        if (
            valueIndex !== -1 &&
            !args[valueIndex]
                .split(/,|\s+/g)
                .filter((str) => str !== '')
                .every((arg) => Number(arg) >= 0 && Number(arg) <= 99)
        ) {
            return 'Values must be between 0 and 99';
        }
        return '';
    }

    public doOperation(
        command: string,
        updateSlider: (val: number) => void,
        ...args: string[]
    ): string {
        const errMessage = this.getErrorMessageIfInvalidInput(command, args);

        if (errMessage !== '') {
            return errMessage;
        }

        if (!this.dataStructure) {
            return 'Invalid data structure';
        }

        const argumentNames = this.dataStructure.documentation[command].args;
        const parsedArgs = args.map((argument, index) => {
            if (argumentNames[index].endsWith('s')) {
                return argument
                    .split(/,| /g)
                    .filter((value) => value !== '')
                    .map(Number);
            }
            return Number(argument);
        });
        const operation = (this.dataStructure as OperationCapableDataStructure)[command];
        if (typeof operation !== 'function') {
            return `Unsupported operation: ${command}`;
        }

        let captured: LinkedListAlgorithmV1 | undefined;
        if (topicToSnapshotStructureType(this.topicTitle ?? '') === 'linked-list') {
            if (!isLinkedListOperation(command)) {
                return `Unsupported history operation: ${command}`;
            }
            if (this.history.operations.length >= MAX_HISTORY_OPERATIONS) {
                return `History is limited to ${MAX_HISTORY_OPERATIONS} operations. Start a new history to continue.`;
            }
            const growsList = command === 'append' || command === 'prepend' || command === 'insert';
            if (growsList && this.data.length >= MAX_LINKED_LIST_VALUES) {
                return `Snapshots support at most ${MAX_LINKED_LIST_VALUES} list values.`;
            }
            const result = linkedListAlgorithmSchema.safeParse({
                name: command,
                arguments: Object.fromEntries(
                    argumentNames.map((name, index) => [name, parsedArgs[index]])
                ),
            });
            if (!result.success) {
                return 'Invalid Linked List operation arguments.';
            }
            captured = result.data;
        }

        this.finish();
        const animationProducer = operation.call(this.dataStructure, ...parsedArgs);
        // Record only after successful execution; no-op operations still count.
        if (captured) {
            this.history.operations.push(captured);
        }

        this.constructTimeline(animationProducer, updateSlider);

        return '';
    }

    public buildSnapshotDraft(title?: string): SnapshotV1 {
        const structureType = topicToSnapshotStructureType(this.topicTitle ?? '');

        if (structureType === null) {
            throw new Error('Snapshots are only supported for Linked Lists.');
        }

        const normalisedTitle = title?.trim();

        return snapshotV1Schema.parse({
            schemaVersion: SNAPSHOT_SCHEMA_VERSION,
            rendererVersion: SUPPORTED_RENDERER_VERSION,

            ...(normalisedTitle ? { title: normalisedTitle } : {}),

            structure: {
                type: structureType,
                state: {
                    values: [...this.data],
                },
            },

            history: structuredClone(this.history),
        });
    }

    public get documentation(): Documentation {
        return this.dataStructure?.documentation || {};
    }

    public resetDataStructure(): void {
        this.currentTimeline.finish();
        this.currentTimeline.time(0);
        if (this.topicTitle) {
            this.dataStructure = GraphicalDataStructureFactory.create(this.topicTitle);
        }
        this.currentTimeline = new Timeline().persist(true);
        this.startNewHistory();
    }

    public generateDataStructure(): void {
        this.resetDataStructure();
        this.dataStructure?.generate();
        this.startNewHistory();
    }

    private computePrevTimestamp(): number {
        const sortedTimestamps = [...this.timestamps].sort((x, y) => y - x);
        let prevTimestamp = 0;
        for (let i = 0; i < this.timestamps.length; i += 1) {
            if (sortedTimestamps[i] + 25 < this.currentTime) {
                prevTimestamp = sortedTimestamps[i];
                break;
            }
        }
        return prevTimestamp;
    }

    private get currentTime() {
        return Math.min(this.currentTimeline.time(), this.timelineDuration);
    }
}

export default VisualiserController;
