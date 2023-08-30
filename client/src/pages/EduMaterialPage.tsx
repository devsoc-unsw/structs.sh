import React from "react";
import style from './EduMaterialPage.module.scss'

const EduMaterialPage = ({ sidebar, mdxContent }) => {
	return (
		<div className={style.eduMaterialPage}>
			<div className={style.sidebar}>{sidebar}</div>
      <div className={style.mdxContent}>
				<div className={style.mdxContentCenter}>
					{mdxContent}
				</div>
			</div>
		</div>
	)
}

export default EduMaterialPage;