import React from "react";
import "./article.scss";
import {
  ClockCircleOutlined,
  UserOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";
import { Row, Col, Button, Divider, List, Collapse } from "antd";

const { Panel } = Collapse;

function Article({ data }) {
  return (
    <div className="article">
      <h1>{data.name}</h1>
      <Row justify="center">
        <Col>
          <Button type="text">
            <ClockCircleOutlined /> {data.totalTime}
            {" phút"}
          </Button>
          <Divider type="vertical" />
          <Button type="text">
            <UserOutlined /> {data.servings}
            {" người"}
          </Button>
        </Col>
      </Row>
      <Row justify="center">
        <img src={data.photos[0][5].url} className="img-preview"></img>
      </Row>
      <Row>
        <div dangerouslySetInnerHTML={{ __html: data.description }}></div>
      </Row>

      <Row>
        <List
          className="list-ing"
          header={<div>Thành Phần:</div>}
          bordered
          dataSource={data.ingredients || []}
          renderItem={(item) => (
            <List.Item>
              <h3>{item.name}</h3>
              <h3>
                <span
                  dangerouslySetInnerHTML={{ __html: item.quantity }}
                ></span>{" "}
                {item.unit.unit}
              </h3>
            </List.Item>
          )}
        />
      </Row>
      <Divider>
        <h3>Cách Thực Hiện</h3>
      </Divider>
      <Row>
        <Collapse
          defaultActiveKey={data.steps.map((x, i) => i)}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          {data.steps.map((s, i) => {
            return (
              <Panel header={"Bước " + (i + 1) + ": " + s.content} key={i}>
                {(s.photos || []).map((p, ii) => {
                  return (
                    <img className="img-step" key={ii} src={p[3].url}></img>
                  );
                })}
              </Panel>
            );
          })}
        </Collapse>
      </Row>
      <Divider></Divider>
      <Row justify="start">
        <i>Nguồn: Cooky.vn</i>
      </Row>
    </div>
  );
}

export default Article;
