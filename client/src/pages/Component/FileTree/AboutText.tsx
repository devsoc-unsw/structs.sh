const AboutText = () => {
  return (
    <>
      <p>
        Development Mode allows you to debug your own C code and visualise the data structures that
        exist in memory.
      </p>
      <p>
        Get started by writing your C code onto the code editor and clicking the Run button. You
        then have the option to configure the data types and variables that help us visualise your
        data structure(s). Then, you can debug and visualise your program in real time by pressing
        the Next button!
      </p>
      <p>
        We currently only support visualising linked lists, but more data structures (arrays, trees
        and graphs) are on their way!
      </p>
      <p>
        If you want some code to try out our debugger with, check out the{' '}
        <a href="https://cgi.cse.unsw.edu.au/~cs1511/23T2/live/week_07/ll_intro.c">
          COMP1511 Programming Fundamentals week 7 lecture code for linked lists.
        </a>
      </p>
      <p>
        Some notes while in development:
        <ul>
          <li>
            Stack inspector is current just a placeholder, doesn&#39;t show actual stack data from
            the debugger yet.
          </li>
          <li>
            If your program reads from stdin (e.g. using scanf, fgets, fgetc etc) you must enter
            your input into the console before executing the line.
          </li>
        </ul>
      </p>
    </>
  );
};

export default AboutText;
