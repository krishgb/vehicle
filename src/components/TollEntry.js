import { useState } from "react";

const options = ["Car/Jeep/Van", "LCV", "Truck/Bus", "Heavy vehicle"];
const capitalize = (word) => {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
}
  


export const TollEntry = (props) => {
  const [formValues, setFormValues] = useState({
    tollname: "",
    vehicles: {
      "Car/Jeep/Van": { single: undefined, return: undefined },
      LCV: { single: undefined, return: undefined },
      "Truck/Bus": { single: undefined, return: undefined },
      "Heavy vehicle": { single: undefined, return: undefined },
    },
  });

  const close = () => {
    props?.setModals((modal) => ({ ...modal, toll: false }));
  };

  const submit = (e) => {
    e.preventDefault();
    let done = true;
    for (const [key, value] of Object.entries(formValues.vehicles)) {
      if (value.single === undefined || value.return === undefined) {
        done = false;
        alert(`Please fill up ${key} type vehicle values`);
        break;
      }
    }

    if (done) {
      close();
      const tolls = JSON.parse(localStorage.getItem("tolls"));
      const newtolls = {...tolls,[capitalize(formValues.tollname)]: formValues.vehicles,}
      localStorage.setItem("tolls", JSON.stringify(newtolls));
      props?.setTableValues(newtolls)
    }
  };

  return (
    <div id="new_toll_modal">
      <div className="head">
        <h2>Add new toll</h2>
        <i className="fa-solid fa-rectangle-xmark" onClick={close}></i>
      </div>

      <form className="body" onSubmit={submit}>
        <div>
          <p>
            Toll Name<i className="red-color">*</i>
          </p>
          <input
            required
            type="text"
            className="capitalize"
            placeholder="Enter toll name"
            onChange={(e) =>
              setFormValues({ ...formValues, tollname: e.target.value })
            }
          />

          <p>
            Vehicle fare details<i className="red-color">*</i>
          </p>

          <Options setFormValues={setFormValues} />
          <Options setFormValues={setFormValues} />
          <Options setFormValues={setFormValues} />
          <Options setFormValues={setFormValues} />
        </div>

        <button>Add details</button>
      </form>
    </div>
  );
};

const Options = ({ setFormValues }) => {
  const [selected, setSelected] = useState("");

  const change = (type, e) => {
    setFormValues(({ tollname, vehicles }) => ({
      tollname,
      vehicles: {
        ...vehicles,
        [selected]: {
          ...vehicles[selected],
          [type]: e.target.valueAsNumber,
        },
      },
    }));
  };

  return (
    <div>
      <select required onChange={(e) => setSelected(e.target.value)}>
        <option value="">Select vehicle type</option>
        {options.map((opt, idx) => {
          return (
            <option key={idx} value={opt}>
              {opt}
            </option>
          );
        })}
      </select>
      <input
        required
        type="number"
        onChange={(e) => change("single", e)}
        placeholder="Single Journey"
      />
      <input
        required
        type="number"
        onChange={(e) => change("return", e)}
        placeholder="Return Journey"
      />
    </div>
  );
};
