import "./index.scss"
import React, { useState, useEffect, useCallback } from 'react'
import GameView from './game';
import { Input, FormGroup, Form, Button } from "reactstrap";
import { LadderBoard } from "./ladderboard";
import axios from 'axios';
const URL = 'http://localhost:3002'
const Main = () => {
  const [userName, setUserName] = useState("")
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [rankingList, setRankingList] = useState([])

  const handleSubmit = e => {
    e.preventDefault()
    setUserName(e.target.username.value)
  } 

  const postData = async (score, time) => {
    const payload = {
      name: userName,
      time,
      stars: score
    };
    try {
      await axios.post(`${URL}/ladderboard`, payload);
    } catch (e) {
      console.log(e);
    }
    await getAllData();
  };
  const getAllData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${URL}/ladderboard?_sort=stars&_order=desc`
      );
      setRankingList(response.data);
    } catch (e) {
      console.log(e);
    }
    
  }, []);

  useEffect(() => {
    getAllData()
  }, [getAllData])

  return (
    <>
      {userName.length === 0 && (
        <div className="form-wrapper">
          <Form onSubmit={handleSubmit} className="form">
            <FormGroup>
              <Input
                required
                style={{ width: "300px" }}
                name="username"
                placeholder="User Name"
              />
            </FormGroup>
            <div style={{ textAlign: "center" }}>
              <Button type="submit">Enter</Button>
            </div>
          </Form>
        </div>
      )}
      {userName && (
        <>
          <div className="game-view-wrapper">
            <GameView postData={postData} setIsPlaying={setIsPlaying} setScore={setScore} setTime={setTime} value={score} timeValue={time} />
          </div>
          <div className="username-wrapper">
            <h2>{userName}</h2>
            <h4>Best Score : {score}</h4>
            <h4>Best Time : {Math.floor(time)}</h4>
            <Button disabled={isPlaying} onClick={() => setOpenModal(true)} style={{marginTop:'30px'}}>Ladder Board</Button>
          </div>
        </>
      )}

      <LadderBoard
        open={openModal}
        toggleModal={setOpenModal} 
        rankingList={rankingList}
      />
    </>
  );
}

export default Main