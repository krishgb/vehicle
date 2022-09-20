import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Filter } from "../assets/filter.svg";
import { VehicleEntry, TollEntry } from "../components";

export const Home = () => {
  const [tableValues, setTableValues] = useState(JSON.parse(localStorage.getItem("vehicles")) || []);
  const [tollNames, setTollNames] = useState([...new Set(tableValues.map(t => t.toll))]) // filter icon values
  const [modals, setModals] = useState({
    toll: false,
    vehicle: false,
    filter: false
  });

  const open = (modal) => {
    setModals({ ...modals, [modal]: true });
  };


  const changeData = search => {
    if(!search.trim().length) {
      setTableValues(JSON.parse(localStorage.getItem('vehicles') || []))
      return
    }
    const newData = tableValues.filter(t => t.vehicleNumber.toLowerCase().includes(search.toLowerCase()))
    setTableValues([...newData])
  }

  const showFilters = () => {
    setTollNames([...new Set(tableValues.map(t => t.toll))])
    setModals({...modals, filter: !modals.filter})
  }

  const showToll = (toll) => {
    let allVehicles = JSON.parse(localStorage.getItem('vehicles') || [])
    if(toll !== ''){
      allVehicles = allVehicles.filter(t => {
        if(t.toll == toll)      console.log(t.toll, toll)
        return  t.toll.toLowerCase()=== toll.toLowerCase()
      })
    }
    setTableValues([...allVehicles])
  }

  return (
    <>
      <main className="header">
        <h3>Toll entries/Vehicle entries</h3>
        <Filter width={20} height={20} 
          onClick={showFilters}
        />
        {modals.filter && <ul>
          <li onClick={() => showToll('')}>All</li>
          {tollNames.map((toll, idx) => <li key={idx} onClick={() => showToll(toll)}>{toll}</li>)}
        </ul>}
        <input placeholder="Search vehicle" onChange={e => changeData(e.target.value)}/>

        <ul>
          <li onClick={() => open("vehicle")}>Add vehicle entry</li>
          <li onClick={() => open("toll")}>Add new toll</li>
          <li>
            <Link to="/tollList">View all tolls</Link>
          </li>
        </ul>
      </main>

      <table>
        <thead>
          <tr className="uppercase">
            <th>Vehicle Type</th>
            <th>Vehicle Number</th>
            <th>Date/Time</th>
            <th>Toll Name</th>
            <th>Tariff</th>
          </tr>
        </thead>

        <tbody>
          {tableValues.map((tableValue, idx) => {
            const { toll, vehicleType, vehicleNumber, tariff, timestamp } = tableValue;
            const time = new Intl.DateTimeFormat("ban", {
                    month: "2-digit",
                    year: "numeric",
                    day: "2-digit",
                    hour: "2-digit",
                    second: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }).format(new Date(timestamp))

            return (
              <tr key={idx}>
                <td>{vehicleType}</td>
                <td>{vehicleNumber}</td>
                <td>
                  {time}
                </td>
                <td>{toll}</td>
                <td>{tariff}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modals.vehicle && <VehicleEntry setModals={setModals} setTableValues={setTableValues}  />}
      {modals.toll && (
        <TollEntry setModals={setModals} />
      )}
    </>
  );
};
