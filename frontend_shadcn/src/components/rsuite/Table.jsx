import { Table, Pagination } from "rsuite";
import React from "react";
const { Column, HeaderCell, Cell } = Table;
import { useStore } from "@nanostores/react";
import { dates, getDataInRange } from "@/utils/dataStore";

export default function CustomTable(props) {
  const [limit, setLimit] = React.useState(10);
  const [page, setPage] = React.useState(1);
  const [defaultData, setDefaultData] = React.useState(props.initalData);
  const [sortColumn, setSortColumn] = React.useState("clicks");
  const [sortType, setSortType] = React.useState("desc");
  const [loading, setLoading] = React.useState(false);

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  const handleChangeLimit = (dataKey) => {
    setPage(1);
    setLimit(dataKey);
  };

  const data = defaultData.filter((v, i) => {
    const start = limit * (page - 1);
    const end = start + limit;
    return i >= start && i < end;
  });
  const $dates = useStore(dates);

  React.useEffect(() => {
    const rowsArr = getDataInRange(props.items, $dates);
    if (sortColumn && sortType) {
      rowsArr.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "desc") {
          return y - x;
        } else {
          return x - y;
        }
      });
    }
    setDefaultData(rowsArr);
  }, [$dates, sortColumn, sortType]);

  return (
    <div>
      <Table
        height={500}
        data={data}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        loading={loading}
      >
        <Column align="left" flexGrow={1}>
          <HeaderCell>Domains</HeaderCell>
          <Cell dataKey="name" />
        </Column>

        <Column flexGrow={2} align="right" sortable>
          <HeaderCell> Gesamte Sessions</HeaderCell>
          <Cell dataKey="clicks" />
        </Column>
      </Table>
      <div style={{ padding: 20 }}>
        <Pagination
          // prev
          // next
          autoHeight={true}
          first
          // last
          boundaryLinks
          maxButtons={5}
          size="lg"
          layout={["limit", "|", "pager"]}
          total={defaultData.length}
          limitOptions={[10, 30, 50]}
          limit={limit}
          activePage={page}
          onChangePage={setPage}
          onChangeLimit={handleChangeLimit}
        />
      </div>
    </div>
  );
}
