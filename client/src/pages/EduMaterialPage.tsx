import React from "react";
import { TopNavbar } from "components/Navbars";
import style from './EduMaterialPage.module.scss'

const EduMaterialPage = ({ sidebar, mdxContent }) => {
	return (
		<div>
      <TopNavbar position="relative" />
			<div className={style.eduMaterialPage}>
				<div className={style.sidebar}>{sidebar}</div>
				<div className={style.mdxContent}>
					<div className={style.mdxContentCenter}>
						{mdxContent}
					</div>
				</div>
			</div>
		</div>
	)
}

export default EduMaterialPage;
