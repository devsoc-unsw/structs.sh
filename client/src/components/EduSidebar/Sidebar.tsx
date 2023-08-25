import React from 'react';

const Sidebar = () => {
  return (
		<div className='sidebar'>
			{ TreeData.map((item, index) => <SidebarItem key={index} item={item} />) }
		</div>
	)
};

export default Sidebar;
