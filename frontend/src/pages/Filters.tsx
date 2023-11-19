import { useState } from 'react';
import { Menu, Select } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

type FiltersProps = {
  filterOptions: string,
  setFilterOptions: React.Dispatch<React.SetStateAction<string>>,
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

const Filters = ({ filterOptions, setFilterOptions }: FiltersProps) => {
  const items: MenuItem[] = [
    getItem('Navigation One', 'sub1', <MailOutlined />, [
      getItem(<Select
        defaultValue={filterOptions}
        className="w-100"
        onChange={(value) => setFilterOptions(value)}
        options={[
          { value: 'name', label: 'по наименованию' },
          { value: 'overPrice', label: 'по убыванию цены' },
          { value: 'lowerPrice', label: 'по возрастанию цены' },
        ]}
      />, '1'),
      getItem('Option 2', '2'),
      getItem('Option 3', '3'),
      getItem('Option 4', '4'),
    ]),
    getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
      getItem('Option 5', '5'),
      getItem('Option 6', '6'),
      getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
    ]),
    getItem('Navigation Three', 'sub4', <SettingOutlined />, [
      getItem('Option 9', '9'),
      getItem('Option 10', '10'),
      getItem('Option 11', '11'),
      getItem('Option 12', '12'),
    ]),
  ];

  const [openKeys, setOpenKeys] = useState(['sub1']);

  const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <Menu
      mode="inline"
      className="position-absolute start-0"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      style={{ width: 256 }}
      items={items}
    />
  );
};

export default Filters;
