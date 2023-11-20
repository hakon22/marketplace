import { useState } from 'react';
import { Menu, Select, Slider } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

type FilterOptions = {
  sortBy: string;
  rangePrice: number[];
}

type FilterProps = {
  filterOptions: FilterOptions,
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>,
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

const Filters = ({ filterOptions, setFilterOptions }: FilterProps) => {
  const { sortBy, rangePrice } = filterOptions;
  console.log(filterOptions);
  const items: MenuItem[] = [
    getItem('Цена', 'sub1', <MailOutlined />, [
      getItem(<Select
        defaultValue={sortBy}
        className="w-100"
        onChange={(value) => setFilterOptions({ sortBy: value, rangePrice })}
        options={[
          { value: 'name', label: 'По алфавиту' },
          { value: 'overPrice', label: 'Сначала дороже' },
          { value: 'lowerPrice', label: 'Сначала дешевле' },
        ]}
      />, '1'),
      getItem(<Slider
        className="w-100"
        range={{ draggableTrack: true }}
        min={rangePrice[0]}
        max={rangePrice[1]}
        defaultValue={rangePrice}
      />, '2'),
      getItem('Option 3', '3'),
      getItem('Option 4', '4'),
    ]),
    getItem('Каллории', 'sub2', <AppstoreOutlined />, [
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
