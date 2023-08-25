import React from "react";
import CodeBlock from "components/CodeBlock";

const LearningMode = () => {
	return (
		<div>
			<CodeBlock>
{`int my_array[2][4] = {
  {1, 2, 3, 4}, // First row
  {5, 6, 7, 8} // Second row
};`}
			</CodeBlock>
		</div>
	)
}

export default LearningMode;
