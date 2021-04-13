import matplotlib
import matplotlib.pyplot as plt
from pylab import rcParams
rcParams['figure.figsize'] = 18, 18

font = {'family' : 'DejaVu Sans',
        'weight' : 'bold',
        'size'   : 22}

matplotlib.rc('font', **font)

fibTiming = open("fib-timing", "r")
times = list(map(lambda x: float(x.strip("\n")), fibTiming.readlines()))

fig, ax = plt.subplots()
ax.plot(range(1, 50), times, 'D--m', label="fib timing")
ax.legend()
ax.set_title("Recursive Fibonacci - O(2ⁿ)")
ax.set_xlabel('Input size')
ax.set_ylabel('Running time (seconds)')
# plt.show()
plt.savefig('fib-timing-graph.png', dpi=100)
