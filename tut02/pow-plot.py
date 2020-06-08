import matplotlib.pyplot as plt

powIterTiming = open("pow-iter-timing", "r")
powRecurTiming = open("pow-recur-timing", "r")
powLogTiming = open("pow-log-timing", "r")

iterTimes = list(map(lambda x: float(x.strip("\n")), powIterTiming.readlines()))
recurTimes = list(map(lambda x: float(x.strip("\n")), powRecurTiming.readlines()))
logTimes = list(map(lambda x: float(x.strip("\n")), powLogTiming.readlines()))

fig, ax = plt.subplots()
ax.plot(range(0, 100), iterTimes, 'D--g', label="Iterative Power")
ax.legend()
ax.plot(range(0, 100), recurTimes, 'D--r', label="Recursive Power")
ax.legend()
ax.plot(range(0, 100), logTimes, 'D--b', label="Recursive O(logn) Power")
ax.legend()
plt.show()
