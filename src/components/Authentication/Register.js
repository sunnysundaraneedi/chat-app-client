import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [show, setShow] = useState(false);
  const [inputFields, setInputFields] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setInputFields((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select an image",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);

      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-engine");
      data.append("cloud_name", "dh0mlxryk");
      fetch("https://api.cloudinary.com/v1_1/dh0mlxryk/image/upload", {
        method: "post",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          setInputFields({ ...inputFields, pic: data.url.toString() });
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error : ", error.message);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (
      !inputFields.name ||
      !inputFields.email ||
      !inputFields.password ||
      !inputFields.confirmPassword
    ) {
      toast({
        title: "Please enter all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (inputFields.password !== inputFields.confirmPassword) {
      toast({
        title: "Passwords doesn't match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: inputFields.name,
          email: inputFields.email,
          password: inputFields.password,
          pic: inputFields.pic,
        }),
      });
      const data = await response.json();
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log("Error : ", error.message);
      toast({
        title: "Errro Occures",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl isRequired>
        <FormLabel>Display Name</FormLabel>
        <Input
          name="name"
          placeholder="Enter your name"
          value={inputFields.name}
          onChange={changeHandler}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          name="email"
          placeholder="Enter your email"
          value={inputFields.email}
          onChange={changeHandler}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={inputFields.password}
            onChange={changeHandler}
          />
          <InputRightElement width={"4.5rem"}>
            <Button size={"sm"} h="1.75rem" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={inputFields.confirmPassword}
            onChange={changeHandler}
          />
          <InputRightElement width={"4.5rem"}>
            <Button size={"sm"} h="1.75rem" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Upload Display Picture</FormLabel>
        <Input
          type={"file"}
          p={1.5}
          name="pic"
          accept="image/*"
          onChange={(event) => postDetails(event.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme={"blue"}
        w={"100%"}
        style={{ marginTop: "15px" }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Register
      </Button>
    </VStack>
  );
};

export default Register;

// const [name, setName] = useState("");
// const [email, setEmail] = useState("");
// const [password, setpassword] = useState("");
// const [password, setConfirmPassword] = useState("");
// const [picture, setPicture] = useState();
