import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface SidebarItemProps {
	item: {
		name: string;
		level: number;
		isOpen: boolean;
		url: string;
		children?: SidebarItemProps['item'][];
	}
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item }) => {
	const [open, setOpen] = useState(item.isOpen || false);
	const [isHighlighted, setIsHighlighted] = useState(false);

	const navigate = useNavigate();

	const currentPath = window.location.pathname;

	useEffect(() => {
		setIsHighlighted(currentPath.includes(item.url));

		if (currentPath.includes(item.url)) {
			setOpen(true);
		}
	}, [currentPath]);

	const toggleOpen = () => {
		setOpen(!open);
		item.isOpen = !item.isOpen;
	};

	const handleTopicClick = (url: string) => {
		navigate(`${url}`);
	};

	if (item.children) {
		return (
			<div className={isHighlighted ? "sidebar-item highlighted" : "sidebar-item"}>
				<div className="">

				</div>
			</div>
		)
	}
}
