import React from "react";
import { Container, Row, Col, Button, Modal, ListGroup } from "react-bootstrap";
import "./aaaa.css";
import ab from "../../queen.png";
import x from "../../x.png";
import { set } from "nprogress";

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
      board2: [],
      /*
      board: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      */
      solution: [],
      occupied: new Set(),
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
      this.state.occupied.add(i);
    }
    this.setState({ board: curBoard });
    this.setState({ board2: JSON.parse(JSON.stringify(curBoard)) });
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

    //alert(JSON.stringify(newBoard));
    this.forceUpdate();
  };

  unavailable = () => {
    const tmpboard = JSON.parse(JSON.stringify(this.state.board));
    this.state.occupied.forEach((val) => {
      for (var i = 0; i < this.state.queens; i++) {
        if (this.isSave(this.state.board, i, val) === false )
          tmpboard[i][val] = -1;
      }
    });
    this.setState({ board: tmpboard });
    this.forceUpdate();
  };
  setCurSolution = (e, i) => {
    this.setState({ curSelectSolution: this.state.solution[i] });
    this.handleOpenS();
  };

  change = (e, i) => {
    if (this.state.solution.length === 0) {
      alert("there is solution for this puzzle yet");
      return;
    }
    const solutionnow = this.state.curSelectSolution || this.state.solution[0];
    this.setState({ board: JSON.parse(JSON.stringify(solutionnow)) });
  };

  solve = () => {
    //alert(JSON.stringify(this.state.board));
    /*
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
    */
    if (this.solveThePuzzle(this.state.board2, 0) === false)
      alert("there is solution for this board");

    const after_filter = [];
    this.state.solution.forEach((vall) => {
      var contains = true;
      visited.forEach((val) => {
        //alert(val[0] +"" +val[1]);
        if (vall[val[0]][val[1]] === 0) {
          contains = false;
        }
      });
      if (contains === true) after_filter.push(vall);
    });

    //alert(JSON.stringify(after_filter));
    this.setState({ solution: after_filter });
    this.forceUpdate();
  };

  addqueen = (e, i, j) => {
    if (!this.isSave(this.state.board, i, j) && (this.state.board[i][j] === 0 || this.state.board[i][j] === -1)) {
      alert("this position can not place queen");
      return;
    }
    var curIndex = this.state.board;
    if (curIndex[i][j] === 1) {
      curIndex[i][j] = 0;
      this.setState({ board: curIndex });
      visited.delete([i, j]);
      this.state.occupied.add(j);
    } else if (curIndex[i][j] === 0 && this.state.queens > 0) {
      curIndex[i][j] = 1;
      visited.add([i, j]);
      this.setState({ board: curIndex });
      this.state.occupied.delete(j);
    } else {
      alert("There is no queen left");
    }
    this.forceUpdate();
  };

  // ************************************************************
  isSave = (board, row, col) => {
    var i, j;
    for (i = 0; i < board.length; i++) if (board[row][i] === 1) return false;

    for (i = row, j = col; i >= 0 && j >= 0; i--, j--)
      if (board[i][j] === 1) return false;

    for (i = row, j = col; j >= 0 && i < board.length; i++, j--)
      if (board[i][j] === 1) return false;
    // used for function unavaliable
    for (i = row, j = col; i < board.length && j < board.length; i++, j++)
      if (board[i][j] === 1) return false;
    for (i = row, j = col; i >= 0 && j < board.length; i--, j++)
      if (board[i][j] === 1) return false;
    for (i = board.length; i >= 0; i--) if (board[row][i] === 1) return false;
    return true;
  };

  solveThePuzzle = (board, col) => {
    if (col === board.length) {
      this.state.solution.push(JSON.parse(JSON.stringify(board)));
      return true;
    }

    var res = false;
    for (var i = 0; i < board.length; i++) {
      if (visited.has(col + "" + i + "")) {
        alert(1);
        continue;
      }
      if (this.isSave(board, i, col)) {
        board[i][col] = 1;
        res = this.solveThePuzzle(board, col + 1) || res;
        board[i][col] = 0;
      }
    }
    return res;
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
            <Button variant="secondary" onClick={(e) => this.change(e)}>
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
        <Container style={{ marginTop: "10vh", marginBottom: " 10vh"}}>
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
          <div style={{outline: "solid 5px", marginTop:'10px',  marginBottom:'12px'}}>
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
                  var img = "";
                  switch (vall) {
                    default:
                      img = "";
                      break;
                    case 1:
                      img = ab;
                      break;
                    case -1:
                      img = x;
                      break;
                  }
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
          </div>
          <Row>
            <Col xs={3}>
              {" "}
              <Button
                style={{ width: "80%" }}
                variant="warning"
                onClick={this.unavailable}
              >
                show unavailable area
              </Button>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
