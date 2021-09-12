import './App.css';
import { Link} from 'react-router-dom';
import React, { useState,  useCallback, useEffect} from 'react';
import Buttonn from './Button';
import Search from  './Search';
import { useRecoilState } from 'recoil';
import { user as userAtom } from "./atoms";
import { us as usAtom } from "./atoms";
import {counterT as counterTAtom} from './atoms';
import {counterF as counterFAtom} from './atoms';
import {search as searchAtom } from "./atoms";
import {Button} from 'theme-ui';
import { index as indexAtom } from "./atoms";
import {ee as eeAtom} from './atoms';
import Pagination from "@material-ui/lab/Pagination";

const App = () =>{

  const [newItem, setNewItem] = useState('');
  const [users, setUsers] = useRecoilState(userAtom);
  const [user, setUser] = useRecoilState(usAtom);
  let [counterT, setCounterT] = useRecoilState(counterTAtom);
  let [counterF, setCounterF] = useRecoilState(counterFAtom);
  const [search, setSearch] = useRecoilState(searchAtom);
  const [index, setIndex] = useRecoilState(indexAtom);
  const [ee, setEE] = useRecoilState(eeAtom);
  const [page, setPage] = useState(0);

  const fetchRequest = useCallback(() => {
  fetch('http://www.7mz.pl/api/data1.json')
  .then(results => results.json())
  .then(data => {
    setUsers(data);
    setCounterT(data.filter(o => o.completed === true).length);
    setCounterF(data.filter(o => o.completed === false).length);
  });
}, [setUsers, setCounterT, setCounterF]);

const updateNewText = (event)=> {
  event.preventDefault();
  setNewItem(event.target.value);
}

const createNew = () =>{
  if(users){
  setUsers(users.concat({
  id:  Math.floor(Math.random() * (3000 + 1)) + 3000, title: newItem, completed: false, date:
   `${new Date().toLocaleDateString()}`
  }))
  setSearch(search.concat({title: newItem}));
 }
  setCounterF(counterF += 1);  
 }

 const addDelete = (i,j) => { 
  const data = [...users];
  setUsers(data.filter((y) => y.id !== i));
  setCounterT(users.filter(o => o.completed === true).length);
  setCounterF(users.filter(o => o.completed === false).length);
}

const addToggle = (j) => {

  const newState = users.map(obj =>
    obj.id === j ? { ...obj, completed: !obj.completed  } : obj
);

setUsers(newState);
let ob = newState.filter(o => o.completed === true)
console.log('Zakończone zadania:', ob);
setCounterT(newState.filter(o => o.completed === true).length);
setCounterF(newState.filter(o => o.completed === false).length);
}

const addVar = (item, i) => {
setUser(item);
setIndex(item.id);
setEE(i);
}

const handleChangePage = (event, newPage) => {
  setPage(newPage-1);
};

  return (
    <div className="App">
      <header className="App-header">
      <Search />
        <div className = 'counters'> 
        <p>Liczba zadań zakończonych: {counterT}</p>
        </div>
        <br />
      <div className = 'btns'>
      <Button type = 'submit' variant='primary' className ='btn0' onClick = {fetchRequest}>Wgraj Dane</Button>
      <Buttonn />
      </div>
      <br />
       <Pagination
              className="my-3"
              count={Math.ceil(users.length/150)}
              page={page+1}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              onChange={handleChangePage}
              defaultPage = {0}
              shape = 'round'
              size = 'medium'
            />
      <table>
          <thead>
            <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Completed</th>
            </tr>
          </thead>
          <tbody>
          {users && users.slice(page * 150, page * 150 + 150).sort((x, y) => y.completed - x.completed).map((item, i) =>
                  <tr key = {item.id}>
                  <td>
                    {item.id}
                
                    </td>
                     <td>
                     <Link onClick = {(j) => { addVar(item, i)}} to ='/item'> {item.title}</Link>
                    </td>
                    <td>
                    
                    <input className = 'inpt1' type ='checkbox' data-id={i} defaultChecked= {item.completed} onChange = {(j) => {
                     addToggle(item.id)}} />
                    </td>
                  
                    <td>
                    <Button type = 'submit' variant='secondary' className ='btn btn-warning' onClick = {addDelete.bind(null, item.id)}>Ukryj</Button>
                    </td>
                </tr>
                )}
          </tbody>
        </table>
        <input className = 'inpt2' onChange = {updateNewText} />
        <Button type = 'submit' variant='secondary' className ='btn3' onClick = {createNew}>Dodaj tytuł czynności</Button>
       </header>
       <footer><p>autor: Maciej Zaleski</p>
       </footer>               
    </div>
  );

}
export default App;
