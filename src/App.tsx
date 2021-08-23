import { Col, Input, Row, Table } from "antd";
import React, { useEffect, useState, useCallback } from "react";

import { getPeopleList, Person } from "./api";
import columns from "./columns";

import "./App.css";

/* TODO: Implement debouncer */
let timer: NodeJS.Timeout | undefined;
function debounce(func: () => void, wait: number) {
  return ((...args) => {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout (() => {
      func.apply(context, args)
    }, wait);
  })
}

// let timer = null;
// const throttle = (func, wait) => {
//   return ((...args) => {
//     if (timer) return;
//     const context = this;
//     timer = setTimeout(func.apply(this, args), wait)
//   })
// }

function App() {
  const [data, setData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // state to keep track of the current searchValue;
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  const filter = useCallback(() => {
    /* TODO: Implement search filter */
    if (searchValue === '') {
      setFilteredData (data.filter(person => { return true }))
    }
    else {
      setFilteredData (data.filter(person => 
        Object.values(person).some((value) => 
        value.toString().includes(searchValue))));
    }
  }, [data, searchValue]);

  const debouncedFilter = useCallback(() => {
    debounce(filter, 1000)();
  }, [filter]);

  useEffect(() => {
    debouncedFilter();
  }, [debouncedFilter]);

  const fetchPeople = useCallback(() => {
    setIsLoading(true);
    getPeopleList()
      .then(response => {
        setData(response);
        setIsLoading(false);
      })
      .catch((e) => console.error(e));
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return (
    <div className="App">
      <h1>People</h1>
      <Row className="Row">
        <Col>
          <Input allowClear placeholder="search people" onChange={
              (event) => {
                setSearchValue(event.target.value)
              }
            } />
        </Col>
      </Row>
      <Table
        bordered={true}
        columns={columns}
        dataSource={filteredData}
        loading={isLoading}
      />
    </div>
  );
}

export default App;
