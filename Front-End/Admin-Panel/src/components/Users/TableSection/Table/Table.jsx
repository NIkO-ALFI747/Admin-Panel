import { useEffect } from 'react';
import DataTable from 'datatables.net-react';
import $ from 'jquery';
import DT from 'datatables.net-bs5';

import 'datatables.net-select-bs5';
import 'datatables.net-responsive-bs5';
import 'datatables.net-scroller-bs5';
import 'datatables.net-colreorder-bs5';
import './Table.css'

DataTable.use(DT);

function Table({ tableData, dtRef, tableRef, updateSelectedCount }) {

  useEffect(() => {
    if (!tableRef.current) return;
    const dt = $(tableRef.current).find('table').DataTable();
    dtRef.current = dt;
    dt.on('select', updateSelectedCount);
    dt.on('deselect', updateSelectedCount);
    updateSelectedCount();
  }, []);

  const options =
  {
    rowId: 'id',
    responsive: {
      details: {
        type: 'column',
        target: 0
      }
    },
    scrollY: '50vh',
    scrollCollapse: true,
    stateSave: true,
    columns: [
      {
        className: 'dtr-control',
        orderable: false,
        data: null,
        defaultContent: ''
      },
      {
        data: null,
        render: DT.render.select()
      },
      { data: 'name' },
      { data: 'email' },
      { data: 'lastLoginTime' },
      { data: 'lastActivityTime' },
      { data: 'registrationTime' },
      { data: 'status' }
    ],
    select: {
      style: 'multi',
      selector: 'td:nth-child(2)',
      headerCheckbox: 'select-page'
    },
    columnDefs: [
      { orderable: false, targets: [0, 1] }
    ],
    colReorder: {
      columns: ':not(:first-child, :nth-child(2))'
    },
    order: [[2, 'asc']]
  }

  return (
    <div ref={tableRef}>
      <DataTable
        data={tableData}
        className="table table-sm table-hover display nowrap"
        options={options}
      >
        <thead className="table-light">
          <tr>
            <th></th>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login Time</th>
            <th>Last Activity Time</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody class="table-group-divider"></tbody>
      </DataTable>
    </div>
  );
}

export default Table;