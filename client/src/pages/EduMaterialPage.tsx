import React, { useEffect, useRef } from "react";
import { TopNavbar } from "components/Navbars";
import style from './EduMaterialPage.module.scss';
import gsap from 'gsap';
import SplitText from "gsap-trial/SplitText";

const EduMaterialPage = ({ sidebar, mdxContent }) => {

	return (
		<div>
      <TopNavbar position="fixed" />
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
