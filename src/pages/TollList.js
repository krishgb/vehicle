import {useState} from "react";
import {Link} from 'react-router-dom'
import {VehicleEntry, TollEntry} from '../components'

const vehicleTypes = ['Car/Jeep/Van', 'LCV', 'Truck/Bus', 'Heavy vehicle']
export const TollList = () => {
  const [modals, setModals] = useState({
    toll: false,
    vehicle: false,
  })

  const [data, setData] = useState(JSON.parse(localStorage.getItem('tolls')) || {})

  const setSearch = (search) => {
    if(!search.trim().length){
      const tolls = JSON.parse(localStorage.getItem('tolls')) || {}
      setData(tolls)
      return
    }else{
      const newData = {} 
      Object.keys(data).map(d => {
        if(d.toLowerCase().includes(search))
        newData[d] = data[d]
      })
      setData(newData)
      
    }
  }

  const open = (modal) => {
    setModals({ ...modals, [modal]: true })
  }

  return (
    <>
      <main className="header">
        <h3>Toll entries/Vehicle entries</h3>
        <input placeholder="Search a toll" onChange={e => setSearch(e.target.value)}/>

        <ul>
          <li onClick={() => open("vehicle")}>Add vehicle entry</li>
          <li onClick={() => open("toll")}>Add new toll</li>
          <li>
            <Link to="/">Back to vehicle logs</Link>
          </li>
        </ul>
      </main>


      <table>
        <thead>
          <tr className="uppercase">
            <th>Tollname</th>
            <th>Car/Jeep/Van</th>
            <th>LCV</th>
            <th>Truck/Bus</th>
            <th>Heavy Vehicle</th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(data).map((toll, idx) => {
            return (
              <tr key={idx}>
                <td>{toll[0]}</td>
                {vehicleTypes.map((vt, index) => {
                  return <td key={index}>
                    {toll[1][vt]?.single}/{toll[1][vt]?.return}
                  </td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      {modals.vehicle && <VehicleEntry setModals={setModals}   />}
      {modals.toll && (
        <TollEntry setModals={setModals} setTableValues={setData}/>
      )}
      {!Object.keys(data).length && <p>Toll not found</p>}
    </>
  )
}
