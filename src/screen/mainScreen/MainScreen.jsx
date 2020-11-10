import React from "react";
import { Container, Row, Col, Button, Modal, ListGroup } from "react-bootstrap";
import "./aaaa.css";
import ab from "../../queen.png";

const Item = ListGroup.Item;
const colors = {
  1: "gray",
  2: "green",
};

const colors2 = {
  2: "gray",
  1: "green",
};

const visited = new Set();
export default class MainScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [],
      /*
      board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      */
      solution: [],
      queens: 8,
      show: false,
      showselected: false,
      curSelectSolution: null,
    };
  }

  componentDidMount() {
    var curBoard = [];
    for (var i = 0; i < this.state.queens; i++) {
      curBoard.push(new Array(this.state.queens).fill(0));
    }
    this.setState({ board: curBoard });
  }

  clear = () => {
    var newBoard = [];
    this.state.board.forEach((val) => {
      newBoard.push(new Array(val.length).fill(0));
    });
    this.setState({
      board: newBoard,
      solution: [],
      queens: 8,
    });

    alert(JSON.stringify(newBoard));
    this.forceUpdate();
  };

  setCurSolution = (e, i) => {
    var cur = [];
    for (var j = 0; j < 8; j++) cur.push(this.state.board[j]);
    this.state.solution[i].forEach((val) => {
      cur[val[0]][val[1]] = 1;
    });
    this.setState({ curSelectSolution: cur });
    this.handleOpenS();
  };

  change = (e, i) => {
    var cur = [];
    for (var j = 0; j < 8; j++) cur.push(this.state.board[j]);
    const solutionnow = this.state.solution[i] || this.state.solution[0];
    solutionnow.forEach((val) => {
      cur[val[0]][val[1]] = 1;
    });
    this.setState({ board: cur });
  };

  solve = () => {
    var list = [],
      ans = [];
    this.backTracking(
      visited,
      0,
      this.state.queens,
      this.state.board,
      list,
      ans
    );
    this.setState({ solution: ans });
    if (ans.length === 0) {
      alert("there is no solution for this board");
    }
    this.forceUpdate();
  };

  backTracking = (set, x, n, board, a, ans) => {
    if (n === 0) {
      var tmp = [];
      a.forEach((val) => {
        tmp.push(val);
      });
      ans.push(tmp);
      return;
    }

    for (var start = x; start < board.length * board.length; start++) {
      var i = parseInt(start / board.length, 10),
        j = parseInt(start % board.length, 10);
      if (
        set.has(i + "row") ||
        set.has(j + "col") ||
        set.has(i - j + "d") ||
        this.state.board[i][j] === 1
      )
        continue;
      set.add(i + "row");
      set.add(j + "col");
      set.add(i - j + "d");
      a.push([i, j]);
      var cur = n - 1;
      this.backTracking(set, start + 1, cur, board, a, ans);
      a.pop();
      set.delete(i + "row");
      set.delete(j + "col");
      set.delete(i - j + "d");
    }
  };

  addqueen = (e, i, j) => {
    var curIndex = this.state.board;
    if (curIndex[i][j] === 1) {
      curIndex[i][j] = 0;
      this.setState({ board: curIndex });
      this.setState({ queens: this.state.queens + 1 });
    } else if (curIndex[i][j] === 0 && this.state.queens > 0) {
      curIndex[i][j] = 1;
      this.setState({ board: curIndex });
      visited.add(i + "row");
      visited.add(j + "col");
      visited.add(i - j + "d");
      this.setState({ queens: this.state.queens - 1 });
    } else {
      alert("There is no queen left");
    }
    this.forceUpdate();
  };

  // close modal
  handleClose = () => {
    this.setState({ show: false });
  };
  handleCloseS = () => {
    this.setState({ showselected: false, show: true });
  };

  handleOpen = () => {
    this.setState({ show: true });
  };

  handleOpenS = () => {
    this.setState({ showselected: true, show: false });
  };
  render() {
    const { show, showselected } = this.state;
    return (
      <>
        <Modal show={showselected} onHide={this.handleCloseS}>
          <Modal.Header closeButton>
            <Modal.Title>{`Current selected solution`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.curSelectSolution &&
              this.state.curSelectSolution.map((val, index) => {
                return (
                  <Item style={{ textAlign: "center" }}>
                    {JSON.stringify(val.join(`      `))}
                  </Item>
                );
              })}
        
          </Modal.Body>
          <Modal.Footer>
              <Button variant="secondary" onClick={(e) => this.change(e, 0)}>
                yes
              </Button>
            </Modal.Footer>
        </Modal>
        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{`Total solution: ${this.state.solution.length}`}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.solution &&
              this.state.solution.map((val, index) => {
                return (
                  <Item
                    className="solutionItem"
                    onClick={(e) => this.setCurSolution(e, index)}
                  >
                    {`solution ${index}:  ${JSON.stringify(val)}`}
                  </Item>
                );
              })}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <Container style={{ marginTop: "10vh", marginBottom: " 10vh" }}>
          <Row>
            <Col xs={3}>
              {" "}
              <Button
                style={{ width: "80%" }}
                variant="warning"
                onClick={this.solve}
              >
                sovling puzzle
              </Button>
            </Col>
            <Col xs={3}>
              {" "}
              <Button
                style={{ width: "80%" }}
                variant="warning"
                onClick={this.change}
              >
                generate
              </Button>
            </Col>
            <Col xs={3}>
              {" "}
              <Button
                style={{ width: "80%" }}
                variant="warning"
                onClick={this.clear}
              >
                clear
              </Button>
            </Col>
            <Col xs={3}>
              {" "}
              <Button
                style={{ width: "80%" }}
                variant="warning"
                onClick={this.handleOpen}
              >
                show solution
              </Button>
            </Col>
          </Row>
          {this.state.board.map((val, index) => {
            return (
              <Row
                xs={10}
                key={"row" + index}
                style={{
                  height: (100 / this.state.board.length) * 0.8 + "vh",
                  alignContent: "center",
                  justifyContent: "center",
                  textAlignVertical: "center",
                  textAlign: "center",
                  margin: "0.1vh",
                }}
              >
                {val.map((vall, a) => {
                  const cur = index % 2 === 0 ? colors2 : colors;
                  const img = vall === 1 ? ab : "";
                  return (
                    <Col
                      xs={16 / vall.length}
                      style={{
                        alignContent: "center",
                        justifyContent: "center",
                        textAlignVertical: "center",
                        textAlign: "center",
                        backgroundColor: cur[(a % 2) + 1],
                        margin: "0.1vh",
                        height: "100%",
                      }}
                    >
                      <Button
                        style={{
                          backgroundColor: "transparent",
                          outlineColor: "transparent",
                          borderColor: "transparent",
                          marginTop: "10%",
                          backgroundImage: `url(${img})`,
                          backgroundSize: "100% 100%",
                          height: "80%",
                          width: "80%",
                        }}
                        onClick={(e) => {
                          this.addqueen(e, index, a);
                        }}
                      ></Button>
                    </Col>
                  );
                })}
              </Row>
            );
          })}
        </Container>
      </>
    );
  }
}
