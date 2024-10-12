'use client';

import { createApi } from "@/src/app/api";
import { useQuery } from "@tanstack/react-query";
import { Button, Select, Skeleton, Space, Table, TableColumnsType, Tabs, Flex, Empty } from "antd";
import { DefaultOptionType, LabeledValue } from "antd/es/select";
import axios from "axios";
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface DataType {
  id: string;
  mark: string;
  engine: string;
  equipment: string;
  price: string;
  date: string;
}

const columns: TableColumnsType<DataType> = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 200,
  },
  {
    title: 'Марка/модель',
    dataIndex: 'mark',
    sorter: (a, b) => a.mark.toUpperCase() < b.mark.toUpperCase() ? -1 : a.mark.toUpperCase() > b.mark.toUpperCase() ? 1 : 0,
    width: 200,
  },
  {
    title: 'Модификация',
    dataIndex: 'engine',
    sorter: (a, b) => a.engine.toUpperCase() < b.engine.toUpperCase() ? -1 : a.engine.toUpperCase() > b.engine.toUpperCase() ? 1 : 0,
    width: 200,
  },
  {
    title: 'Комплектация',
    dataIndex: 'equipment',
    sorter: (a, b) => a.equipment.toUpperCase() < b.equipment.toUpperCase() ? -1 : a.equipment.toUpperCase() > b.equipment.toUpperCase() ? 1 : 0,
    width: 200,
  },
  {
    title: 'Стоимость',
    dataIndex: 'price',
    sorter: (a, b) => +a.price.split(' ')[0] < +b.price.split(' ')[0] ? -1 : +a.price.split(' ')[0] > +b.price.split(' ')[0] ? 1 : 0,
    width: 200,
  },
  {
    title: 'Дата создания',
    dataIndex: 'date',
    sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    width: 200,
  },
]

export default function Home() {
  const [activeKey, setActiveKey] = useState('')
  const [selectValues, setSelectValues] = useState<DefaultOptionType[] | []>([])
  const api = createApi();

  const dataMarks = useQuery({
    queryKey: ['marks'],
    queryFn: () => api.main.getMarks(),
  })
  const dataModels = useQuery({
    queryKey: ['models', activeKey],
    queryFn: ({ queryKey }) => api.main.getModelsMark(queryKey[1]),
  })
  const dataMarkRows = useQuery({
    queryKey: ['markRows', activeKey, selectValues],
    queryFn: ({ queryKey }) => api.main.getFiltredRows(queryKey[1], queryKey[2]),
    select: (data) => data?.map((item, i) => {
        return {
          key: i,
          id: item.id,
          mark: `${item.mark} ${item.model ? item.model : ''}`,
          engine: `${item.engine.volume} ${item.engine.transmission} (${item.engine.power} л.с.) ${item.drive ? item.drive : ''}`,
          equipment: item.equipmentName === 'ПустаяКомплектация' ? '-' : item.equipmentName,
          price: `${item.price} ₽`,
          date: format(item.createdAt, "dd.MM.yyyy 	kk:mm"),
        }
    })
  })

  useEffect(() => {
    if (!dataMarks.isLoading && dataMarks.data && !dataMarks.isError) {
      setActiveKey(dataMarks.data[0].mark)
    }
  }, [dataMarks.data])

  return (
    <main className="p-4">
      {dataMarks.isLoading ?
      <Space className="mb-[16px] flex flex-nowrap w-full overflow-x-hidden">
        {Array(30).fill(0).map((_, i) => (
          <Skeleton.Input key={i} active />
        ))}
      </Space>
      :
      <Tabs
        defaultActiveKey={dataMarks.data && dataMarks.data[0].mark}
        onChange={(key) => {
          setActiveKey(key)
          setSelectValues([])
        }}
        items={dataMarks.isLoading ? [] : dataMarks.isError ? [] : dataMarks.data && dataMarks.data.map((item, i) => {
          return {
            label: `${item.mark} - ${item._count.id}`,
            key: item.mark,
          };
        })}
    />
      }
      <Flex align="flex-start" gap="small" vertical>
        <h3 className='font-medium'>Модель:</h3>
        <Select
          value={selectValues}
          maxTagCount='responsive'
          mode="multiple"
          allowClear
          style={{ width: '300px' }}
          placeholder="Please select"
          options={dataModels.isLoading ? [] : dataModels.isError ? [] : dataModels.data && dataModels.data.filter(item => item.model).map((item) => ({
            label: item.model,
            value: item.model,
          }))}
          onChange={(value) => setSelectValues(value)}
          onDeselect={(value) => setSelectValues(selectValues.filter((item: DefaultOptionType) => item !== value))}
        />
        <Button onClick={() => setSelectValues([])} type="primary">Сбросить</Button>
      </Flex>
      <Table
        className='mt-[16px]'
        bordered={true}
        columns={columns}
        dataSource={dataMarkRows.isLoading ? [] : dataMarkRows.data}
        locale={{
          emptyText: dataMarkRows.isLoading ?
          <div className="flex flex-col gap-[16px]">
            {Array(10).fill(0).map((_, i) => (
              <Skeleton.Node key={i} active style={{ width: '100%', height: '33px' }} />
            ))}
          </div>
          : <Empty />
        }}
        scroll={{ x: 'max-content', y: 55 * 10 }}
      />
    </main>
  );
}
