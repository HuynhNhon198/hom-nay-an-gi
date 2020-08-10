import React, { useState, useEffect } from "react";
import "./App.scss";
import TitleBar from "./components/title-bar/title-bar";
import Article from "./components/article/article";
import { Row, Col, Button, Divider } from "antd";
import { DeleteFilled, HeartFilled, SettingFilled } from "@ant-design/icons";

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomDataFromAPI = async () => {
  const page = randomInteger(1, 200);
  const res = await fetch(
    `https://www.cooky.vn/directory/search?q=null&st=3&lv=2&cs=&cm=&dt=&igt=&oc=&p=&crs=4&page=${page}&pageSize=&append=true&video=false`
  );
  const list = (await res.json()).recipes;
  const item = list[randomInteger(0, list.length - 1)];
  if (item) {
    const resDetail = await fetch(
      `https://marketapi.cooky.vn/recipe/v1.3/detail?id=${item.Id}&checksum=2fec6cab3ba18b02adfa5dd600482931`
    );
    const jsonDetail = await resDetail.json();
    if (jsonDetail.message === "Success") {
      return jsonDetail.data;
    }
  }
  return;
};

function App() {
  const [data, setData] = useState();

  useEffect(() => {
    if (!data) {
      getRandomDataFromAPI().then((res) => {
        setData(res);
      });
    }
  });

  if (data) {
    return (
      <Row justify="center">
        <Col xs={22} sm={18} md={14} lg={12}>
          <Article data={data}></Article>
          <div className="action-bar">
            <Row>
              <Col>
                <Button
                  style={{ background: "#F44336", border: "#F44336 solid 1px" }}
                  type="primary"
                  shape="circle"
                  icon={<HeartFilled />}
                />
                <Divider type="vertical"></Divider>
                <Button type="primary" shape="circle" icon={<DeleteFilled />} />
                <Divider type="vertical"></Divider>
                <Button
                  style={{
                    background: "rgb(44 44 44)",
                    border: "rgb(44 44 44) solid 1px",
                  }}
                  type="primary"
                  shape="circle"
                  icon={<SettingFilled />}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    );
  } else {
    return null;
  }
}

export default App;
