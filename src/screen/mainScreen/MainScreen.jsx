import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import "./aaaa.css";
import ab from "../../queen.png";
import x from "../../x.png";
import Select from "react-select";

const Item = ListGroup.Item;
const colors = {
  1: "gray",
  2: "green",
};

const colors2 = {
  2: "gray",
  1: "green",
};

// select style
var options = [{ label: "1 queen", value: 1 }];

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
      visited: new Set(),
      queens: 8,
      show: false,
      showselected: false,
      curSelectSolution: null,
      loading: "none",
    };
  }

  componentDidMount() {
    for (var j = 2; j <= 16; j++) {
      options.push({ label: `${j} queens`, value: j });
    }
    var curBoard = [];
    for (var i = 0; i < this.state.queens; i++) {
      curBoard.push(new Array(this.state.queens).fill(0));
      this.state.occupied.add(i);
    }
    this.setState({
      board: curBoard,
      board2: JSON.parse(JSON.stringify(curBoard)),
    });
  }

  selectQueen = (e) => {
    const val = e.value;
    var curBoard = [];
    for (var i = 0; i < val; i++) {
      curBoard.push(new Array(val).fill(0));
      this.state.occupied.add(i);
    }
    this.setState({
      board: curBoard,
      board2: JSON.parse(JSON.stringify(curBoard)),
      queen: val,
      visted: new Set(),
      occupied: new Set(),
    });
    this.forceUpdate();
  };
  clear = () => {
    var newBoard = [];
    this.state.board.forEach((val) => {
      newBoard.push(new Array(val.length).fill(0));
    });
    this.setState({
      board: newBoard,
      board2: JSON.parse(JSON.stringify(newBoard)),
      visted: new Set(),
      occupied: new Set(),
    });
    this.forceUpdate();
  };

  unavailable = () => {
    const tmpboard = JSON.parse(JSON.stringify(this.state.board));
    this.state.occupied.forEach((val) => {
      for (var i = 0; i < this.state.queens; i++) {
        if (this.isSave(this.state.board, i, val) === false)
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
    var mysolution = [];
    if (this.solveThePuzzle(this.state.board2, 0, mysolution) === false)
      alert("there is solution for this board");

    const after_filter = [];
    mysolution.forEach((vall) => {
      var contains = true;
      this.state.visited.forEach((val) => {
        //alert(val[0] +"" +val[1]);
        if (vall[val[0]][val[1]] === 0) {
          contains = false;
        }
      });
      if (contains === true) after_filter.push(vall);
    });

    //alert(JSON.stringify(after_filter));
    this.setState({ solution: after_filter, loading: "none"});
    this.forceUpdate();
  };

  addqueen = (e, i, j) => {
    if (
      !this.isSave(this.state.board, i, j) &&
      (this.state.board[i][j] === 0 || this.state.board[i][j] === -1)
    ) {
      alert("this position can not place queen");
      return;
    }
    var curIndex = this.state.board;
    if (curIndex[i][j] === 1) {
      curIndex[i][j] = 0;
      this.setState({ board: curIndex });
      this.state.visited.delete([i, j]);
      this.state.occupied.add(j);
    } else if (curIndex[i][j] === 0 && this.state.queens > 0) {
      curIndex[i][j] = 1;
      this.state.visited.add([i, j]);
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

  solveThePuzzle = (board, col, mysolution) => {
    if (col === board.length) {
      mysolution.push(JSON.parse(JSON.stringify(board)));
      return true;
    }

    var res = false;
    for (var i = 0; i < board.length; i++) {
      if (this.state.visited.has(col + "" + i + "")) {
        alert(1);
        continue;
      }
      if (this.isSave(board, i, col)) {
        board[i][col] = 1;
        res = this.solveThePuzzle(board, col + 1, mysolution) || res;
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
        <Spinner
          animation="border"
          role="status"
          style={{ display: `${this.state.loading}` }}
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
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
              <Select
                onChange={(e) => {
                  console.log(e);
                  this.selectQueen(e);
                }}
                label="Select Queens"
                options={options}
              />
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
          <div
            style={{
              outline: "solid 5px",
              marginTop: "10px",
              marginBottom: "12px",
            }}
          >
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
          </Row>
        </Container>
      </>
    );
  }
}
