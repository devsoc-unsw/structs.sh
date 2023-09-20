import { Style } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineDown, AiOutlineRight } from 'react-icons/ai';
import style from './Sidebar.module.scss';

interface SidebarItemProps {
	name: string;
	url: string;
	level: number;
	children: SidebarItemProps[];
}

const SidebarItem: React.FC<SidebarItemProps> = (item) => {
	const { name, url, level, children } = item;
	const currentPath = window.location.pathname;
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);
	const [isHighlighted, setIsHighlighted] = useState(false);

	useEffect(() => {
		setIsHighlighted(currentPath.includes(item.url));

		if (currentPath.includes(item.url)) {
			setOpen(true);
		}
	}, [currentPath]);

	const toggleOpen = () => {
		setOpen(!open);
	};

	const handleTopicClick = (url: string) => {
		navigate(`/learning${url}`);
	};

	if (item.children.length !== 0) {
		return (
			<div className={isHighlighted ? style.sidebarItemHighlighted : style.sidebarItem}>
				<div className={style.sidebarTitle} onClick={toggleOpen}>
					<div className={style.sidebarName}>{name}</div>
					<div className={style.sidebarArrow}>
						{open ? <AiOutlineDown /> : <AiOutlineRight />}
					</div>
				</div>
				{open && (
        <div>
          {item.children.map((child, index) => (
            <SidebarItem key={index} name={child.name} url={child.url} level={child.level} children={child.children} />
          ))}
        </div>
      )}
			</div>
		)
	} else {
		return (
			<div className={`${currentPath === item.url ? style.SidebarItemFocus : style.sidebarItem}`}>
        <div className={style.sidebarTitleLeaf} onClick={() => handleTopicClick(item.url)}>{item.name}</div>
      </div>
		)
	}
}

export default SidebarItem;
