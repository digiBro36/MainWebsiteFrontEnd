'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useServices } from '@/hooks/useServices';

const colors = ['#10b981', '#ef4444'];

export function ServicesStatusChart() {
  const { data: services = [] } = useServices();

  const active = services.filter((service) => service.active).length;
  const inactive = services.length - active;

  const data = [
    { name: 'Active', value: active },
    { name: 'Inactive', value: inactive },
  ];

  return (
    <div className="h-56">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
