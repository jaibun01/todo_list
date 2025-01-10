"use client";
import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";

const CalculatePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [total, setTotal] = useState<any>([]);
  const [result, setResult] = useState<string>();
  const [operator, setOperator] = useState<string>();
  const [currentInput, setCurrentInput] = useState<string>("");
  const [previousInput, setPreviousInput] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   const [operator, setOperator] = useState<string[]>([]);

  const handleNumberClick = (value: string) => {
    setCurrentInput(currentInput === "0" ? value : currentInput + value);
    setResult(currentInput === "0" ? value : currentInput + value);
  };

  const handleOperatorClick = (op: string) => {
    if (currentInput === "") return;
    setOperator(op);
    setPreviousInput(currentInput);
    setCurrentInput("");
    setResult("0"); // Reset display after operator
  };

  const handleEqualsClick = () => {
    if (operator === null || currentInput === "" || previousInput === null)
      return;

    let result;
    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput);

    switch (operator) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        result = num1 / num2;
        break;
      default:
        return;
    }

    setResult(result.toString());
    setCurrentInput(result.toString());
    setOperator("");
    setPreviousInput(null);
  };
  const calculate = (a: number | string) => {
    console.log("a", a);

    if (a !== "=") {
      setTotal([...total, a]);
      if ((a as string) === "c") {
        setTotal([]);
        setResult("0");
        setCurrentInput("");
        setPreviousInput("");
        setResult("0");
      } else if (typeof a === "number") {
        handleNumberClick(a?.toString());
      } else if (typeof a === "string") {
        handleOperatorClick(a);
      }
    } else {
      // a === "="
      handleEqualsClick();
    }
  };
  console.log("total", total);
  console.log("result", result);

  return (
    <Box sx={{ width: "300px", height: "400px", background: "#52504F", p: 1 }}>
      <Box sx={{ display: "flex", alignItems: "start", gap: 1 }}>
        <Box
          sx={{
            width: "20px",
            height: "20px",
            background: "red",
            borderRadius: "100%",
          }}
        >
          X
        </Box>
        <Box
          sx={{
            width: "20px",
            height: "20px",
            background: "yellow",
            borderRadius: "100%",
          }}
        >
          X
        </Box>
        <Box
          sx={{
            width: "20px",
            height: "20px",
            background: "green",
            borderRadius: "100%",
          }}
        >
          X
        </Box>
      </Box>
      <Box
        sx={{
          height: "70px",
          display: "flex",
          alignItems: "end",
          justifyContent: "end",
          flexDirection: "column",
          pr: 3,
          pb: 3,
        }}
      >
        <Typography variant="body1">{total.join(" ")}</Typography>
        {result && <Typography variant="body1">{result}</Typography>}
      </Box>
      <Grid container spacing={2}>
        {[
          "c",
          "%",
          "/",
          "*",
          "-",
          "+",
          ".",
          "=",
          0,
          1,
          2,
          3,
          4,
          5,
          6,
          7,
          8,
          9,
        ].map((item) => {
          return (
            <Grid item xs={3} key={item} spacing={1} p={0}>
              <Box
                onClick={() => {
                  calculate(item);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#7E7C7B",
                  "&:hover": {
                    background: "#FFFFFF80",
                  },
                }}
              >
                <Typography sx={{ color: "white" }}>{item}</Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CalculatePage;
