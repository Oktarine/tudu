import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import AuthService from "../services/auth.service";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';


import { api_service } from "../settings";

const currentUser = AuthService.getCurrentUser();

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function BasicTabs() {

  const [left, setLeft] = React.useState([]);
  const [right, setRight] = React.useState([]);

  const [Title, setTitle] = React.useState("");
  const [Description, setDescription] = React.useState("");

  const fetchata = async () => {


    const response = await fetch(
      `http://${api_service}/taskList/${currentUser.id}`);

    if (response.ok) {

      const data = await response.json();
      const TODO_LIST = data.result

      let todoLeft = []
      let todoRight = []

      var index1
      for (index1 = TODO_LIST.length - 1; index1 >= 0; --index1) {


        const data2 = TODO_LIST[index1];
        if (TODO_LIST[index1].completed == 0) {
          todoLeft.push(data2);
        } else {
          todoRight.push(data2);
        }
        setRight(todoRight)
        setLeft(todoLeft)

      }

    } else {
      alert("Ошибка HTTP: " + response.status);
    }

  }

  useEffect(() => {
    fetchata();
  }, []);

  console.log(right)

  const handAddTask = async () => { //Добавление Task 
    const stubi1 = {//данные которые отпраляются на бэк-api и в левый столбец
      // id: left[Number(left.length) - 1].id + 1, //это ид нужно только для клиента . сервер заноситт ид в базу сам 
      title: Title,
      description: Description,
      user_id: currentUser.id,
      completed: 0
    }

    setLeft([...left, stubi1]) //Добовляем элемент в левый столбец
    setTitle(" ") // Очистка поля Title
    setDescription(" ") // Очистка поля Description



    const response = await fetch(`http://${api_service}/addTask`, { // Отправка на бэк-api
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },

      body: JSON.stringify(stubi1)
    });

    if (response.ok) {
      fetchata();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }




  }


  const completTask = async (idTask) => {// Выполнение Task
    const odject = left.filter(odj => odj.id == idTask)// Обьект массива из правого столбца
    odject[0].completed = 1; // Замена переменной отвечающей за выполненность задания 

    setLeft(left.filter(odj => odj.id != idTask)) //Удаляем элемент из лнвого столбца
    setRight([...right, odject[0]]) //Заносим элемент из левого столбца в правый


    const stubi1 = { //данные которые отпраляются на бэк-api (ид задания)
      id: idTask,
    }


    const response = await fetch(`http://${api_service}/compTask`, { // Отправка на бэк-api
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },

      body: JSON.stringify(stubi1)
    });

    if (response.ok) {
      fetchata();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }



  }

  const deleteletTask = async (idTask) => { //Удаление Task
    setRight(right.filter(odj => odj.id != idTask))
    setLeft(left.filter(odj => odj.id != idTask))

    const stubi1 = { //данные которые отпраляются на бэк-api (ид задания)
      id: idTask,
    }

    const response = await fetch(`http://${api_service}/delTask`, { // Отправка на бэк-api
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },

      body: JSON.stringify(stubi1)
    });

    if (response.ok) {
      fetchata();
    } else {
      alert("Ошибка HTTP: " + response.status);
    }




  }


  const customList = (items) => (
    <Paper sx={{ width: "52vh", height: "50vh", overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value) => {
          return (
            <ListItem>

              <ListItemText id={Number(value.id)} primary={` ${(value.title)} || ${(value.description)}`} />

              <Button
              
                color="error"
                sx={{ my: 0.5 ,mx:1}}
                variant="outlined"
                size="small"
                onClick={() => { deleteletTask(value.id) }}
              // disabled={rightChecked.length === 0}

              >
                del
              </Button>

              {value.completed ? (
                <></>) : (
                <Button
                  color="success"
                  sx={{ my: 0.5 }}
                  variant="outlined"
                  size="small"
                  onClick={() => { completTask(value.id) }}
                // disabled={rightChecked.length === 0}

                >
                  &gt;
                </Button>)}






            </ListItem>
          );
        })}
      </List>
    </Paper>
  );


  if (currentUser) {


    return (

      <Container maxWidth="xl" >
        <Box mt={3}>
          <Stack spacing={2}>
            <TextField id="outlined-basic" label="Title" variant="outlined"
              value={Title}
              onChange={(event) => {
                setTitle(event.target.value);
              }} />

            <TextField
              id="outlined-multiline-static"
              label="Description"
              multiline
              rows={4}
              defaultValue=" "
              value={Description}
              onChange={(event) => {
                setDescription(event.target.value);
              }} />
            <Button variant="contained" onClick={handAddTask}>ADD TASK</Button>
          </Stack>
        </Box>


        <Box mt={10}>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item>{customList(left)}</Grid>
            <Grid item>
            </Grid>
            <Grid item>{customList(right)}</Grid>
          </Grid>
        </Box>

      </Container>
    );
  } else (
    window.location.href = '/home' //Не залогинился - переброс на дом
  );


}
