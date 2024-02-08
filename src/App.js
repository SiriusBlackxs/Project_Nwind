import { useState } from "react";
function App() {
  const [data, setData] = useState([]);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null)
  const [primaryKey, foundPrimaryKey] = useState([])
  const [primaryKeyorder, foundPrimaryKeyorder] = useState([])
  const [primaryKeyEmployee, foundprimaryKeyEmployee] = useState([])
  const [isOrderHeaderTextVisible, setOrderHeaderTextVisible] = useState(false);
  const [isOrderDetailsHeaderTextVisible, setOrderdetailsHeaderTextVisible] = useState(false);

  // Take the data from the Server.js path: /request-data
  const fetchData = () =>
    fetch("/request-data")
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setData(data);
        setIsDataFetched(true)
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  // Take the data from the Server.js path: /images-response

  const fetchDataImage = async (id) => {
    await fetch(`/images-response/${id}`)
      .then(response => response.text())
      .then(data => {
        const container = document.getElementById('Image-container');
        container.innerHTML = data;
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  };

  // Search the position for customer of the company name called "Reggiani Caseifici" and highlight it.
  const selectClientPosition = () => {
    const index = data[1].findIndex(customer => customer.CompanyName === "Reggiani Caseifici")
    console.log(index)
    setSelectedRow(index)
  };
  // Show the popout that count the clients from "Mexico",width and height can be changed at will
  const showMessage = () => {
    let counter = 0;
    for (let i = 0; i < data[1].length; i++) {
      if (data[1][i].Country === "Mexico") {
        counter++
      }
    }
    console.log(counter)
    const nextWindow = window.open("", "", "width=400,height=200")
    nextWindow.document.write(`<h1 id="Text-popup">Sono ubdicati in Mexico: ${counter} clienti</h1>`)
  }
  //Create a table based on the CustomerID called Order
  const selectOrderByCustomer = (customerid) => {
    const ordersForCustomer = data[2].filter(customer => customer.CustomerID === customerid);
    if (ordersForCustomer.length > 0) {
      foundPrimaryKey(ordersForCustomer);
      setOrderHeaderTextVisible(true);
    }
    console.log(ordersForCustomer);
  }

  //Create a table based on the OrderID called OrderDetails
  const selectOrdersDetailsByOrder = (orderID) => {
    const detailsOrder = data[3].filter(order => order.OrderID === orderID)
    if (detailsOrder.length > 0) {
      foundPrimaryKeyorder(detailsOrder)
      setOrderdetailsHeaderTextVisible(true);
    }
    console.log(detailsOrder)
  }
  const selectImageByIdEmployee = (employeeID) => {
    const image_order = data[0].filter(image_id => image_id.EmployeeID === employeeID)
    if (image_order.length > 0) {
      foundprimaryKeyEmployee(image_order)
    }
    console.log(image_order)
  }

  //EmployeeID

  return (
    <>
      <div className="App">
        <h1 id='header_text'>Database Information</h1>
        <button className="button_fetchdata" onClick={fetchData}>Fetch Data</button>
        <button className="button_showselectClientPosition" onClick={selectClientPosition}>Reggiani Caseifici</button>
        <button className="button_customer" onClick={showMessage}>Customer in Mexico</button>
        {/*------------------------------------------------------------------------------------------------------------------------------- */}
        {/*--------------------------------------------------TABLE CUSTOMER----------------------------------------------------------------*/}

        {isDataFetched && data[1].length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>City</th>
                <th>CompanyName</th>
                <th>ContactTitle</th>
                <th>Country</th>
                <th>CustomerID</th>
                <th>Fax</th>
                <th>Phone</th>
                <th>PostalCode</th>
                <th>Region</th>
              </tr>
            </thead>
            <tbody>
              {data[1].map((customer, i) => (
                <tr onClick={() => selectOrderByCustomer(customer.CustomerID)} key={i} style={i === selectedRow ? { backgroundColor: "#FFFF00" } : {}}>
                  <td>{customer.Address}</td>
                  <td>{customer.City}</td>
                  <td>{customer.CompanyName}</td>
                  <td>{customer.ContactTitle}</td>
                  <td>{customer.Country}</td>
                  <td>{customer.CustomerID}</td>
                  <td>{customer.Fax}</td>
                  <td>{customer.Phone}</td>
                  <td>{customer.PostalCode}</td>
                  <td>{customer.Region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/*------------------------------------------------------------------------------------------------------------------------------- */}
        {/*---------------------------------------------------TABLE ORDER------------------------------------------------------------------*/}

        <h1 id='header_text_order' style={{ display: isOrderHeaderTextVisible ? 'block' : 'none' }}>Database Order</h1>
        <div id="Image-container"></div>
        {primaryKey.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Freight</th>
                <th>Order Date</th>
                <th>Required Date</th>
                <th>Shipped Date</th>
                <th>Ship Via</th>
                <th>Ship Address</th>
                <th>Ship City</th>
                <th>Ship Region</th>
                <th>Ship Postal Code</th>
                <th>Ship Country</th>
              </tr>
            </thead>
            <tbody>
              {primaryKey.map((order, i) => (
                <tr key={i} onClick={() => { selectOrdersDetailsByOrder(order.OrderID); selectImageByIdEmployee(order.EmployeeID); fetchDataImage(order.EmployeeID) }}>
                  <td>{order.Freight}</td>
                  <td>{order.OrderDate}</td>
                  <td>{order.RequiredDate}</td>
                  <td>{order.ShippedDate}</td>
                  <td>{order.ShipVia}</td>
                  <td>{order.ShipAddress}</td>
                  <td>{order.ShipCity}</td>
                  <td>{order.ShipRegion}</td>
                  <td>{order.ShipPostalCode}</td>
                  <td>{order.ShipCountry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/*------------------------------------------------------------------------------------------------------------------------------- */}
        {/*-------------------------------------------------TABLE ORDER DETAILS------------------------------------------------------------*/}

        <h1 id='header_text_orderDetails' style={{ display: isOrderDetailsHeaderTextVisible ? 'block' : 'none' }}>Database Order Details</h1>
        {primaryKeyorder.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>OrderID</th>
                <th>ProductID</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Discount</th>
              </tr>
            </thead>
            <tbody>
              {primaryKeyorder.map((orderDetails, i) => (
                <tr key={i}>
                  <td>{orderDetails.OrderID}</td>
                  <td>{orderDetails.ProductID}</td>
                  <td>{orderDetails.Quantity}</td>
                  <td>{"$" + orderDetails.UnitPrice}</td>
                  <td>{Number(orderDetails.Discount).toFixed(2) * 100 + "%"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


    </>
  );
}

export default App;
