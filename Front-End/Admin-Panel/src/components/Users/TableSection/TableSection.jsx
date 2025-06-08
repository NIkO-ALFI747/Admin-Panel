import { useState, useRef, useEffect } from 'react';
import $ from 'jquery';
import Toolbar from './Toolbar/Toolbar.jsx';
import Table from './Table/Table.jsx'

function TableSection() {
  const [tableData, setTableData] = useState([
    { id: 1, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" },
    { id: 2, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "blocked" },
    { id: 3, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" },
    { id: 4, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" },
    { id: 5, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" },
    { id: 6, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" },
    { id: 7, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" },
    { id: 8, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" },
    { id: 9, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" },
    { id: 10, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" },
    { id: 11, name: "Airi Satou", email: "Accountant", lastLoginTime: "33", lastActivityTime: "Tokyo", registrationTime: "Japan", status: "active" }
  ]);

  const [selectedCount, setSelectedCount] = useState(0);
  const tableRef = useRef(null);
  const dtRef = useRef(null);

  const updateSelectedCount = () => {
    const dt = $(tableRef.current).find('table').DataTable();
    const count = dt.rows({ selected: true }).count();
    setSelectedCount(count);
  };

  useEffect(() => {
    updateSelectedCount();
  }, [tableData]);

  const deleteUser = () => {
    if (!dtRef.current) return;
    const selectedData = dtRef.current.rows({ selected: true }).data().toArray();
    const selectedIds = selectedData.map(row => row.id);
    dtRef.current.rows({ selected: true }).deselect();
    setTableData(currentData => currentData.filter(row => !selectedIds.includes(row.id)));
  };

  const blockUser = (blockStatus) => {
    if (!dtRef.current) return;
    const selectedRows = dtRef.current.rows({ selected: true });
    const selectedData = selectedRows.data().toArray();
    const selectedIds = selectedData.map(row => row.id);
    const action = blockStatus ? 'Blocking' : 'Unblocking';
    setTableData(currentData =>
      currentData.map(row =>
        selectedIds.includes(row.id) ? { ...row, status: blockStatus ? 'blocked' : 'active' } : row
      )
    );
  };

  return (
    <div className="container mt-4">
      <Toolbar selectedCount={selectedCount} blockUser={blockUser} deleteUser={deleteUser} />
      <Table tableData={tableData} dtRef={dtRef} tableRef={tableRef} updateSelectedCount={updateSelectedCount} />
    </div>
  );
}

export default TableSection;