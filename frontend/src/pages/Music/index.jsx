/** @format */

import React, { useEffect, useState, useRef } from "react";
import "./index.scss";
import "../../assets/iconfont/font_4033099_e0huu1oupqg/iconfont.css";
import logo from "@/assets/logo.png";
import photo3 from "@/assets/image/photo3.jpeg";
import photo2 from "@/assets/image/photo2.webp";
import photo1 from "@/assets/image/photo1.jpeg";
import pexels from "@/assets/image/pexels-photo-3171815.webp";
import gameBg from "@/assets/image/gameBg.jpg";
import {
  Button,
  Form,
  Input,
  Space,
  Switch,
  Dropdown,
  Col,
  Row,
  Divider,
  List,
  Avatar,
  Modal,
  Upload,
  Image,
} from "antd";
import Carousel from "./swiper";
import { PlusCircleOutlined } from "@ant-design/icons";
import {
  CheckOutlined,
  CloseOutlined,
  AlignCenterOutlined,
  StepBackwardOutlined,
  PauseOutlined,
  StepForwardOutlined,
  MenuUnfoldOutlined,
  UpCircleOutlined,
  PicLeftOutlined,
  RetweetOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import InfiniteScroll from "react-infinite-scroll-component";
import VirtualList from "rc-virtual-list";
export default function MusicPlay() {
  const [renderLink, setRenderLink] = useState(false);
  const [renderNav, setRenderNav] = useState(false);
  const [position, setPosition] = useState("bottom");
  const [align, setAlign] = useState("center");
  const [menuIndex, setMenuIndex] = useState(0);
  const [menuStyle, setMenuStyle] = useState({
    background: "#0A7777",
    border: "solid 1px #0A7777",
    width: "calc(100% - 20px)",
    height: "60px",
    lineHeight: "60px",
    fontSize: "16px",
    textAlign: "center",
  });
  const [songList, setSongList] = useState([
    { name: "Song name", singer: "singer" },
    { name: "Song name", singer: "singer" },
    { name: "Song name", singer: "singer" },
    { name: "Song name", singer: "singer" },
    { name: "Song name", singer: "singer" },
  ]);
  const [songQueueList, setSongQueueList] = useState([
    { name: "Song name", singer: "singer" },
    { name: "Song name", singer: "singer" },
    { name: "Song name", singer: "singer" },
    { name: "Song name", singer: "singer" },
    { name: "Song name", singer: "singer" },
  ]);
  const rules = [{ required: true }];
  const [form] = useForm();
  const menuList = [
    {
      name: "MUSIC",
      icon: "icon-yinle",
    },
    { name: "GAME", icon: "icon-xiangce" },
    { name: "PHOTOS", icon: "icon-airudiantubiaohuizhi-zhuanqu_youxi" },
  ];
  const items = [
    {
      key: "Logout",
      label: "Logout",
    },
    {
      key: "My Party Space",
      label: "My Party Space",
    },
    {
      key: "Party settings",
      label: "Party settings",
    },
  ];
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const musicRef = useRef(null);
  // 预览图片
  const contentStyle = {
    margin: 0,
    color: "#fff",
    height: "calc(100%)",
    background: "#364d79",
  };
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  // 分割线
  // 上传图片
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-3",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-4",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const forceUpdate = () => {
    this.forceUpdate();
  };
  const handleCancel = () => setPreviewOpen(true);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    console.log(file.url, file.preview);
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(false);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  // 分割线
  function handleTogglePlay() {
    if (isPlaying) {
      musicRef.current.pause();
    } else {
      musicRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handleTimeUpdate() {
    setCurrentTime(musicRef.current.currentTime);
    setDuration(musicRef.current.duration);
  }

  function handleSeek(e) {
    const seekTime = e.target.value;
    musicRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  }

  // 分割线

  const submit = () => {
    form.validateFields().then((values) => {
      console.log("提交表单submit", values);
    });
  };

  const back = () => {
    console.log("返回主页party space");
  };

  const menuClick = ({ key }) => {
    console.log("菜单项点击", key);
  };

  
  // 动态设置背景图片
  const [bgImage, setBgImage] = useState(photo3);

  const leftMenuClick = ({ item, index }) => {
    console.log("左侧菜单点击", item, index);
    if(renderNav){
      if(index == 0){
        setBgImage(photo3);
      }
      if(index == 1){
        setBgImage(photo1);
      }
      if(index == 2){
        setBgImage(pexels);
      }
    }else{
      if(index == 0){
        setBgImage(photo2);
      }
      if(index == 1){
        setBgImage(photo1);
      }
      if(index == 2){
        setBgImage(pexels);
      }
    }
    setMenuIndex(index);
  };

  useEffect(() => {
    if (document.body.clientWidth > 450) {setRenderNav(true)}
    else setRenderNav(false);
  }, [document.body.clientWidth]);
  return (
    <div className="party-space-seting bese">
      <header>
        <img src={logo} />
        {renderNav ? (
          <div>
            <Space>
              <Button type="link">My Party Space</Button>
              <Button type="link">Party settings</Button>
              <Button type="primary" shape="round">
                Logout
              </Button>
            </Space>
          </div>
        ) : (
          <div>
            <Dropdown
              getPopupContainer={(e) => e}
              trigger={["click"]}
              menu={{ items, onClick: menuClick }}
            >
              <Button icon={<AlignCenterOutlined />}></Button>
            </Dropdown>
          </div>
        )}
      </header>
      <div
        className="main"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat:"no-repeat",
          backgroundSize:"cover",
          backgroundColor: "rgba(0,0,0,0.6)",
          backgroundBlendMode: "multiply",
        }}
      >
        {renderNav ? (
          <div style={{ height: "calc(100% - 160px)", width: "100%" }}>
            <Row style={{ width: "100%" }} justify="space-evenly">
              <Col
                span={6}
                style={{
                  height: "600px",
                  border: "1px solid #EEE",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "150px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    marginLeft: "24px",
                  }}
                >
                  <div style={{ fontSize: "21px", color: "#0A7777" }}>
                    Party space
                  </div>
                  <div style={{ fontSize: "32px" }}>“Party name”</div>
                  <div style={{ fontSize: "16px", color: "#0A7777" }}>
                    20:30, Apr 2, 2023・“place”
                  </div>
                </div>
                <div
                  style={{
                    height: "200px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    marginLeft: "24px",
                    justifyContent: "space-between",
                  }}
                >
                  {menuList.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={leftMenuClick.bind(this, { item, index })}
                        style={
                          index == menuIndex
                            ? menuStyle
                            : {
                                border: "solid 1px #0A7777",
                                width: "calc(100% - 20px)",
                                height: "60px",
                                lineHeight: "60px",
                                fontSize: "14px",
                                color: "#0A7777",
                                textAlign: "center",
                              }
                        }
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </Col>
              <Col span={18}>
                {menuIndex == 0 ? (
                  <Row style={{ width: "100%" }} justify="space-evenly">
                    {" "}
                    <Col
                      span={16}
                      style={{
                        height: "600px",
                        color: "#FFF",
                        overflow: "hidden",
                      }}
                    >
                      <div>
                        <Input placeholder="Search" size="large" />
                      </div>
                      <div
                        style={{
                          marginTop: "20px",
                          border: "1px solid #EEE",
                          height: "calc(100% - 60px)",
                        }}
                      >
                        {songList.length > 0 ? (
                          <div
                            style={{
                              fontSize: "28px",
                              color: "#0A7777",
                              paddingLeft: "24px",
                            }}
                          >
                            Search Result
                          </div>
                        ) : (
                          ""
                        )}
                        <List
                          size="large"
                          // pagination={{
                          //   position,
                          //   align,
                          // }}
                          dataSource={songList}
                          renderItem={(item, index) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    size={64}
                                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                                  />
                                }
                                title={
                                  <a
                                    style={{ color: "#FFF", fontSize: "22px" }}
                                  >
                                    {item.name}
                                  </a>
                                }
                                description={
                                  <a
                                    style={{
                                      color: "#92C3C3",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {item.singer}
                                  </a>
                                }
                              />
                              <div>
                                <PlusCircleOutlined
                                  style={{ color: "#FFF", fontSize: "28px" }}
                                />
                              </div>
                            </List.Item>
                          )}
                        />
                      </div>
                    </Col>
                    <Col
                      span={6}
                      style={{
                        height: "600px",
                        border: "1px solid #EEE",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "28px",
                          color: "#0A7777",
                          paddingLeft: "24px",
                        }}
                      >
                        Playback Queue
                      </div>
                      <div>
                        <List
                          size="large"
                          // pagination={{
                          //   position,
                          //   align,
                          // }}
                          dataSource={songQueueList}
                          renderItem={(item, index) => (
                            <List.Item>
                              <List.Item.Meta
                                avatar={
                                  <Avatar
                                    size={64}
                                    src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                                  />
                                }
                                title={
                                  <a
                                    href="https://ant.design"
                                    style={{ color: "#FFF", fontSize: "22px" }}
                                  >
                                    {item.name}
                                  </a>
                                }
                                description={
                                  <a
                                    href="https://ant.design"
                                    style={{
                                      color: "#92C3C3",
                                      fontSize: "16px",
                                    }}
                                  >
                                    {item.singer}
                                  </a>
                                }
                              />
                            </List.Item>
                          )}
                        />
                      </div>
                    </Col>
                  </Row>
                ) : menuIndex == 1 ? (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      paddingLeft: "24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          height:"523px",
                          background: "rgba(217, 217, 217, 0.6)",
                          marginBottom: "24px",
                          fontSize: "32px",
                          color: "#000",
                          fontWeight: "700",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          overflow:"hidden"
                        }}
                      >
                        <img src={gameBg} width={"100%"} height={"100%"} alt="" />
                      </div>
                      <button
                        style={{
                          height: "53px",
                          width: "100%",
                          textAlign: "center",
                          fontSize: "16px",
                          lineHeight: "53px",
                          background: "#FFF",
                          color: "rgba(10, 119, 119, 1)",
                          borderRadius: "50px",
                          border: "none",
                        }}
                      >
                        <p> Play game</p>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ height: "100%", paddingLeft: "24px" }}>
                    {previewOpen ? (
                      <Upload
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                      >
                        {fileList.length >= 8 ? null : uploadButton}
                      </Upload>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          marginLeft: "24px",
                        }}
                      >
                        {/* 轮播图片 */}
                        <Carousel
                          images={fileList}
                          handleCancel={handleCancel}
                        ></Carousel>
                      </div>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </div>
        ) : menuIndex == 0 ? (
          <div
            style={{
              height: "calc(100%)",
              width: "100%",
              padding: " 10px 16px",
            }}
          >
            <div>
              <Input placeholder="Search" size="large" />
            </div>
            <div
              style={{
                marginTop: "20px",
                border: "1px solid #aaa",
                height: "calc(40%)",
              }}
            >
              {songList.length > 0 ? (
                <div
                  style={{
                    fontSize: "18px",
                    color: "#0A7777",
                    paddingLeft: "24px",
                  }}
                >
                  Search Result
                </div>
              ) : (
                ""
              )}
              {/*  */}
              <div
                id="scrollableDiv"
                style={{
                  height: "calc(100% - 40px)",
                  overflow: "auto",
                }}
              >
                <InfiniteScroll
                  dataLength={songList.length}
                  hasMore={songList.length < 50}
                  endMessage={
                    <Divider plain>It is all, nothing more 🤐</Divider>
                  }
                  scrollableTarget="scrollableDiv"
                >
                  <List
                    size="small"
                    style={{ overflow: "hidden" }}
                    // pagination={{
                    //   position,
                    //   align,
                    // }}
                    dataSource={songList}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              size={32}
                              src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                            />
                          }
                          title={
                            <a style={{ color: "#FFF", fontSize: "16px" }}>
                              {item.name}
                            </a>
                          }
                          description={
                            <a style={{ color: "#92C3C3", fontSize: "14px" }}>
                              {item.singer}
                            </a>
                          }
                        />
                        <div>
                          <PlusCircleOutlined
                            style={{ color: "#FFF", fontSize: "18px" }}
                          />
                        </div>
                      </List.Item>
                    )}
                  />
                </InfiniteScroll>
              </div>
              {/*  */}
            </div>
            <div
              id="scrollableDiv"
              style={{
                height: "calc(40%)",
                overflow: "auto",
                border: "1px solid #aaa",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  fontSize: "16px",
                  color: "#0A7777",
                  paddingLeft: "24px",
                }}
              >
                Playback Queue
              </div>
              <InfiniteScroll
                dataLength={songList.length}
                hasMore={songList.length < 50}
                endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  size="small"
                  style={{ overflow: "hidden" }}
                  // pagination={{
                  //   position,
                  //   align,
                  // }}
                  dataSource={songList}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size={32}
                            src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`}
                          />
                        }
                        title={
                          <a style={{ color: "#FFF", fontSize: "16px" }}>
                            {item.name}
                          </a>
                        }
                        description={
                          <a style={{ color: "#92C3C3", fontSize: "14px" }}>
                            {item.singer}
                          </a>
                        }
                      />
                      <div>
                        <PlusCircleOutlined
                          style={{ color: "#FFF", fontSize: "18px" }}
                        />
                      </div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </div>
        ) : menuIndex == 1 ? (
          <div
            style={{
              height: "calc(100%)",
              width: "100%",
              display: "flex",
              padding: " 10px 16px",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <div
              style={{
                height: "80%",
                color: "#000",
                fontWeight: "700",
                background: "rgba(255, 255, 255, 0.5)",
                border: "none",
                width: "100%",
                fontSize: "36px",
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <img src={gameBg} style={{width:"100%",height:"100%"}} alt="" />
            </div>
            <div>
              <button
                style={{
                  color: "#0A7777",
                  background: "#FFFFFF",
                  border: "none",
                  width: "100%",
                  height: "48px",
                  borderRadius: "24px",
                }}
              >
                Play game
              </button>
            </div>
          </div>
        ) : (
          <div style={{ height: "100%", width: "100%", padding: " 10px 10px" }}>
            {previewOpen ? (
              <div style={{width:"100%",height:"100%"}}>
                <div style={{width:"100%",height:"35%",fontSize:"24px",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
                  <span>“Party name”</span>
                </div>
                <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              </div>
            ) : (
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {/* 轮播图片 */}
                <div
                  style={{
                    height: "50%",
                    display: "flex",
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Carousel
                    images={fileList}
                    handleCancel={handleCancel}
                  ></Carousel>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="footer">
        <div style={{ width: "100%", height: "100px", overflow: "hidden" }}>
          {renderNav ? (
            <div
              style={{
                width: "100%",
                height: "100px",
                background: "#1F1F22",
                color: "#eee",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <Avatar
                  size={64}
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=1`}
                />
                <div style={{ marginLeft: "12px", fontSize: "14px" }}>
                  <div style={{ color: "#FCFCFC" }}>Angels</div>
                  <div
                    style={{
                      color: "rgba(252, 252, 252, 0.65)",
                      fontSize: "15px",
                    }}
                  >
                    theXX
                  </div>
                  <div style={{ color: "rgba(252, 252, 252, 0.65)" }}>
                    Angels Angels Angels
                  </div>
                </div>
              </div>
              <div style={{ flex: 3 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    paddingTop: "20px",
                  }}
                >
                  <StepBackwardOutlined style={{ fontSize: "28px" }} />{" "}
                  {isPlaying ? (
                    <PauseOutlined
                      style={{ fontSize: "28px" }}
                      onClick={handleTogglePlay}
                    />
                  ) : (
                    <PauseOutlined
                      style={{ fontSize: "28px" }}
                      onClick={handleTogglePlay}
                    />
                  )}{" "}
                  <StepForwardOutlined style={{ fontSize: "28px" }} />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "20px",
                  }}
                >
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    style={{ width: "80%" }}
                  />
                  <audio
                    ref={musicRef}
                    src="https://www.ytmp3.cn/down/78650.mp3"
                    onTimeUpdate={handleTimeUpdate}
                  />
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  fontSize: "24px",
                  color: "#FFF",
                }}
              >
                <MenuUnfoldOutlined />
                <UpCircleOutlined />
                <PicLeftOutlined />
                <RetweetOutlined />
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100px",
                background: "#1F1F22",
                color: "#eee",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    style={{ width: "100%" }}
                  />
                  <audio
                    ref={musicRef}
                    src="https://www.ytmp3.cn/down/78650.mp3"
                    onTimeUpdate={handleTimeUpdate}
                  />
                </div>
              </div>
              <div style={{ flex: 5, display: "flex", alignItems: "center" }}>
                <Avatar
                  size={64}
                  src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=1`}
                />
                <div style={{ marginLeft: "12px", fontSize: "14px", flex: 1 }}>
                  <div style={{ color: "#FCFCFC" }}>Angels</div>
                  <div
                    style={{
                      color: "rgba(252, 252, 252, 0.65)",
                      fontSize: "13px",
                    }}
                  >
                    Angels
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    paddingTop: "20px",
                    flex: 2,
                  }}
                >
                  <StepBackwardOutlined style={{ fontSize: "28px" }} />{" "}
                  {isPlaying ? (
                    <PauseOutlined
                      style={{ fontSize: "28px" }}
                      onClick={handleTogglePlay}
                    />
                  ) : (
                    <PauseOutlined
                      style={{ fontSize: "28px" }}
                      onClick={handleTogglePlay}
                    />
                  )}{" "}
                  <StepForwardOutlined style={{ fontSize: "28px" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {renderNav ? (
        ""
      ) : (
        <div
          style={{
            width: "100%",
            height: "64px",
            display: "flex",
            background: "rgba(10, 119, 119, 1)",
            justifyContent: "space-around",
            textAlign: "center",
          }}
        >
          {menuList.map((item, index) => {
            return (
              <div
                onClick={leftMenuClick.bind(this, { item, index })}
                style={
                  index == menuIndex ? { color: "#FFF" } : { color: "#ccc" }
                }
                key={index}
              >
                <div>
                  <span
                    style={{ fontSize: "24px" }}
                    className={`iconfont ${item.icon}`}
                  ></span>
                </div>
                <div style={{ fontSize: "18px" }}>{item.name}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
