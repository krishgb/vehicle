import { useEffect, useState } from "react"

export const VehicleEntry = (props) => {
  const storedValues = JSON.parse(localStorage.getItem("tolls")) || {}
  const tollnames = Object.keys(storedValues) || []

  const [formValues, setFormValues] = useState({
    toll: tollnames[0] || "",
    vehicleType: "Car/Jeep/Van",
    vehicleNumber: "",
    tariff: 0,
  })

  useEffect(() => {
    const toll =
      JSON.parse(localStorage.getItem("tolls"))[formValues.toll] || {}
    const tariff =
      toll[formValues.vehicleType]?.single +
      toll[formValues.vehicleType]?.return
    setFormValues({ ...formValues, tariff })
  }, [formValues.toll, formValues.vehicleType])

  const close = () => {
    props?.setModals((modal) => ({ ...modal, vehicle: false }))
  }

  const submit = (e) => {
    e.preventDefault()
    const vehicles = JSON.parse(localStorage.getItem("vehicles")) || []
    let newValue = {}
    let modified = false
    for(let i = 0; i < vehicles.length; i++){
      let vehicle = vehicles[i]

      const t = (Math.abs(Date.now() - vehicle.timestamp))/1000/60/60
      if(vehicle.vehicleNumber === formValues.vehicleNumber && vehicle.vehicleType === formValues.vehicleType && (t) < 1){
        modified = true
        const tolls = JSON.parse(localStorage.getItem('tolls'))
        const returntariff = tolls[formValues.toll][formValues.vehicleType]['return']
        newValue = {
            ...formValues, 
            tariff: formValues.tariff - returntariff,
            timestamp: Date.now()
          }
        vehicles[i] = newValue
        break
      }
    }
    newValue = { ...formValues, timestamp: Date.now() }
    !modified && vehicles.push(newValue)
    localStorage.setItem("vehicles", JSON.stringify(vehicles))


    if(props.setTableValues){
      props.setTableValues(vehicles)
    }
    close()
  }

  return (
    <div id="new_vehicle_entry_modal">
      <div className="head">
        <h2>Add new entry</h2>
        <i className="fa-solid fa-rectangle-xmark" onClick={close}></i>
      </div>

      <form className="body" onSubmit={submit}>
        <div>
          <label htmlFor="toll_name">
            Select toll name<i className="red-color">*</i>
          </label>
          <select
            id="toll_name"
            onChange={(e) =>
              setFormValues({ ...formValues, toll: e.target.value })
            }
            required
          >
            {tollnames.map((toll, idx) => (
              <option key={idx} value={toll}>
                {toll}
              </option>
            ))}
          </select>

          <label htmlFor="v_type">
            Select vehicle type<i className="red-color">*</i>
          </label>
          <select
            id="v_type"
            onChange={(e) =>
              setFormValues({ ...formValues, vehicleType: e.target.value })
            }
            required
          >
            <option value="Car/Jeep/Van">Car/Jeep/Van</option>
            <option value="LCV">LCV</option>
            <option value="Truck/Bus">Truck/Bus</option>
            <option value="Heavy vehicle">Heavy vehicle</option>
          </select>

          <label htmlFor="login_id">
            Vehicle Number<i className="red-color">*</i>
          </label>
          <input
            type="text"
            id="login_id"
            placeholder="Enter your login id"
            required
            onChange={(e) => setFormValues({...formValues, vehicleNumber: e.target.value})}
          />

          <label htmlFor="tariff_amt">
            Tariff<i className="red-color">*</i>
          </label>
          <input
            type="number"
            id="tariff_amt"
            readOnly
            value={formValues.tariff}
            placeholder="Tariff amount"
          />
        </div>

        <button>Add entry</button>
      </form>
    </div>
  )
}
