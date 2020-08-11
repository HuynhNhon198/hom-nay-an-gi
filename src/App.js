/*global chrome*/
import React, { useState, useEffect } from "react";
import "./App.scss";
import TitleBar from "./components/title-bar/title-bar";
import Article from "./components/article/article";
import {
  Row,
  Col,
  Button,
  Divider,
  message,
  Drawer,
  Checkbox,
  List,
  Popconfirm,
} from "antd";
import {
  StepForwardOutlined,
  PlusOutlined,
  SettingFilled,
  ArrowUpOutlined,
  CheckOutlined,
  FullscreenOutlined,
  CloseOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { getStorage, setStorage, Purpose } from "./services/helper";

const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getMaxPage = async (api) => {
  const res = await fetch(api);
  return (await res.json()).totalResults;
};

const getRandomDataFromAPI = async () => {
  const opts = getStorage("listOptions") || [];
  let p = [];
  let crs = ["4"];
  opts.forEach((o) => {
    const opt = Purpose.find((x) => x.name === o);
    if (opt.key === "crs") {
      crs = [...crs, opt.id];
    } else {
      p = [...p, opt.id];
    }
  });
  console.log(p, crs);
  const api1 = `https://www.cooky.vn/directory/search?q=null&st=3&lv=2&cs=&cm=&dt=&igt=&oc=&p=${p.join(
    ","
  )}&crs=${crs.join(",")}&pageSize=&append=true&video=false`;
  const total = await getMaxPage(api1);
  const max = Math.round(total / 12);
  const page = randomInteger(1, max);
  const api = `https://www.cooky.vn/directory/search?q=null&st=3&lv=2&cs=&cm=&dt=&igt=&oc=&p=${p.join(
    ","
  )}&crs=${crs.join(",")}&page=${page}&pageSize=&append=true&video=false`;
  const res = await fetch(api);
  const list = (await res.json()).recipes;
  const item = list[randomInteger(0, list.length - 1)];
  if (item) {
    const post = await fetchPost(item.Id);
    if (post) {
      setStorage("current_recipe", post);
    }
    return post;
  }
  return;
};

const fetchPost = async (id) => {
  const resDetail = await fetch(
    `https://marketapi.cooky.vn/recipe/v1.3/detail?id=${id}&checksum=2fec6cab3ba18b02adfa5dd600482931`
  );
  const jsonDetail = await resDetail.json();
  if (jsonDetail.message === "Success") {
    return jsonDetail.data;
  }
  return;
};

function App() {
  const [data, setData] = useState();
  const [save, setSave] = useState(false);
  const [savedList, setSavedList] = useState(getStorage("savedList") || []);
  const [visible, setVisible] = useState(false);
  const [saveListOption, setSaveListOption] = useState(
    getStorage("listOptions")
  );
  const [listOption] = useState(Purpose);

  function next() {
    setData(undefined);
    getRandomDataFromAPI().then((res) => {
      setPost(res);
      window.scrollTo(0, 0);
    });
  }

  function removeItemSaved(i) {
    const list = savedList;
    list.splice(i, 1);
    setSavedList([...list], [savedList]);
    setSave(savedList.find((x) => x.id === data.id) ? true : false);
    setStorage("savedList", savedList);
  }

  function onChangePurpose(values) {
    setStorage("listOptions", values);
  }

  const setPost = (data) => {
    setData(data);
    const saveList = getStorage("savedList") || [];
    setSave(saveList.find((x) => x.id === data.id) ? true : false);
  };

  function saveRecipe() {
    if (!save) {
      const newList = [
        ...savedList,
        {
          id: data.id,
          name: data.name,
        },
      ];
      setStorage("savedList", newList);
      setSave(true);
      message.success("Đã lưu món ăn này vào danh sách lưu", 2);
    }
  }

  function openOptionPage() {
    var win = window.open(chrome.extension.getURL("index.html"), "_blank");
    win.focus();
  }

  useEffect(() => {
    if (!data) {
      const recipe = getStorage("current_recipe");
      console.log(recipe);
      if (recipe && typeof recipe === "object" && recipe !== null) {
        setPost(recipe);
      } else {
        setData(undefined);
        getRandomDataFromAPI().then((res) => {
          setPost(res);
        });
      }
    }
  });

  if (data) {
    return (
      <>
        <Row justify="center">
          <Col xs={22} sm={18} md={14} lg={12}>
            <Article data={data}></Article>
            <div className="action-bar">
              <Row>
                <Col>
                  <Button
                    onClick={saveRecipe}
                    // style={{ background: "#F44336", border: "#F44336 solid 1px" }}
                    type="primary"
                    shape="circle"
                    icon={save ? <CheckOutlined /> : <PlusOutlined />}
                    title="Lưu món này kkk"
                  />
                  <Divider type="vertical"></Divider>
                  <Button
                    onClick={next}
                    type="primary"
                    shape="circle"
                    icon={<StepForwardOutlined />}
                    title="Xem món mới"
                  />
                  <Divider type="vertical"></Divider>
                  <Button
                    onClick={() =>
                      window.scrollTo({
                        top: 0,
                        left: 0,
                        behavior: "smooth",
                      })
                    }
                    type="primary"
                    shape="circle"
                    icon={<ArrowUpOutlined />}
                    title="Cuộn lên trên cùng"
                  />
                  <Divider type="vertical"></Divider>
                  {window.innerWidth < 600 ? (
                    <>
                      <Button
                        type="primary"
                        shape="circle"
                        icon={<FullscreenOutlined />}
                        title="Mở sang trang lớn"
                        onClick={openOptionPage}
                      />
                      <Divider type="vertical"></Divider>
                    </>
                  ) : null}
                  <Button
                    style={{
                      background: "rgb(44 44 44)",
                      border: "rgb(44 44 44) solid 1px",
                    }}
                    onClick={() => {
                      const list = getStorage("savedList") || [];
                      setSavedList(list, [savedList]);
                      setVisible(true);
                    }}
                    type="primary"
                    shape="circle"
                    icon={<SettingFilled spin />}
                    title="Cài Đặt"
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Drawer
          placement="right"
          visible={visible}
          onClose={() => setVisible(false)}
          width={window.innerWidth < 600 ? "90%" : "30%"}
          className="setting"
          closable={false}
        >
          <Divider>Danh Mục</Divider>
          <Checkbox.Group
            defaultValue={saveListOption}
            style={{ width: "100%" }}
            onChange={onChangePurpose}
          >
            <Row>
              {listOption.map((o, i) => {
                return (
                  // <div key={i}>
                  <Col key={i} span={12}>
                    <Checkbox className="checkbox-opt" value={o.name}>
                      {o.name}
                    </Checkbox>
                  </Col>
                  // </div>
                );
              })}
            </Row>
          </Checkbox.Group>
          <Divider>Món Ăn Đã Lưu</Divider>
          <List
            className="list-ing"
            bordered
            dataSource={savedList || []}
            renderItem={(item, i) => (
              <List.Item>
                <span
                  style={{ cursor: "pointer" }}
                  onClick={async () => {
                    const newPost = await fetchPost(item.id);
                    setPost(newPost);
                    setVisible(false);
                  }}
                >
                  <CoffeeOutlined /> &nbsp; {item.name}
                </span>
                <Popconfirm
                  placement="left"
                  title="Bạn có chắc chắn muốn xóa món này khỏi danh sách lưu?"
                  onConfirm={() => {
                    removeItemSaved(i);
                  }}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button size="small" type="text" icon={<CloseOutlined />} />
                </Popconfirm>
              </List.Item>
            )}
          />
        </Drawer>
      </>
    );
  } else {
    return null;
  }
}

export default App;
