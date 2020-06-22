import React, {useState, useEffect} from 'react';
import 'antd/dist/antd.css';
import * as Styled from './components/style.js';
import Columns from './components/columns.js';
import AddCurrencyTransactionModal from './components/addCurrencyTransactionModal/AddCurrencyTransactionModal';

const App = () => {

  const [list, setList] = useState([])
  const [valuePLN, setValuePLN] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    if (valuePLN) renderList()
  }, [valuePLN])

  const changeInputValue = (e) => {
    const {value} = e.target;
    const reg = /^[0-9]*(\.[0-9]{0,2})?$/
    if ((!isNaN(value) && reg.test(value)) || value === '') {
      setValuePLN(value)
    }
  }

  const addCurrencyTransaction = () => {
    setIsModalVisible(true)
  }

  const deleteTransaction = (index) => {
    const data = [...list]
    let names = data.findIndex(item => item.index === index)
    data.splice(names, 1)
    setList(data)
  }

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const saveModal = (payload) => {
    const data = [...list, payload].map((item, index) => {
      return {
        ...item,
        index
      }
    }).sort(comparePln)
    setList(data)
    closeModal()
  }

  const comparePln = (a, b) => {
    const plnA = parseFloat(a.pln);
    const plnB = parseFloat(b.pln);

    let comparison = 0;
    if (plnA < plnB) {
      comparison = 1;
    } else if (plnA > plnB) {
      comparison = -1;
    }
    return comparison;
  }

  const showGreatestValueAndSumPlnAndEuro = () => {
    const sumPln = list.map(item => parseFloat(item.pln)).reduce((prev, next) => prev + next, 0).toFixed(2)
    const sumEuro = list.map(item => parseFloat(item.euro)).reduce((prev, next) => prev + next, 0).toFixed(2)

    return (
      <Styled.GreatesValue>
        <h2>Transakcja o największej kwocie</h2>
        <h3>Nazwa : {list[0] ? list[0].name : null}</h3>
        <h3>Pln : {list[0] ? list[0].pln : null}</h3>
        <h3>Euro : {list[0] ? list[0].euro : null}</h3>
        <h3>Suma PLN : {sumPln}</h3>
        <h3>Suma Euro : {sumEuro}</h3>
      </Styled.GreatesValue>
    )
  }

  const renderList = () => {
    const dataList = list.map(item => {
      const valueToDecimal = parseFloat(item.euro * valuePLN).toFixed(2)
      return {
        ...item,
        pln: valueToDecimal
      }
    }).sort(comparePln)
    setList(dataList)
  }

  return (
    <Styled.Container>
      <Styled.Title>Transakcja Walutowa</Styled.Title>
      <Styled.Input
        addonBefore="1 Euro =" addonAfter="PLN"
        size='small'
        onChange={changeInputValue}
        placeholder='Wpisz liczbę'
        data-testid="search-input"
        allowClear
        value={valuePLN}
      />
      <Styled.Button
        type="primary"
        disabled={!valuePLN}
        onClick={addCurrencyTransaction}> Dodawanie
        transakcji
        walutowej </Styled.Button>
      <Styled.ContainerTable>
        <Styled.Table
          columns={Columns(deleteTransaction)}
          rowKey={record => record.name}
          dataSource={list}
          size="middle"
        />
        < AddCurrencyTransactionModal
          isVisible={isModalVisible}
          onClose={closeModal}
          onSave={saveModal}
          valuePLN={valuePLN}
        />
        {showGreatestValueAndSumPlnAndEuro()}
      </Styled.ContainerTable>
    </Styled.Container>
  );

}

export default App;

