import matplotlib.pyplot as plt

fibTiming = open("fib-timing", "r")
times = list(map(lambda x: float(x.strip("\n")), fibTiming.readlines()))

fig, ax = plt.subplots()
ax.plot(range(1, 50), times, 'D--m')
plt.show()
