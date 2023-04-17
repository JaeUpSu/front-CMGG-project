import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Divider,
  Text,
  RadioGroup,
  HStack,
  Button,
  Input,
  List,
  ListItem,
  Box,
  Image as ChakraImg,
} from "@chakra-ui/react";

import { FieldValues, useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";

import css from "./LectureRegister.module.scss";
import { useDidMountEffect } from "../../../hooks/useDidMountEffect";
import { imgTypes, videoTypes } from "../../../constant";
import { getSecureImgFile } from "../../../utils/getSecureImgFile";
import { createVideoThumbnail } from "../../../utils/createVideoThumbnail";
import { postMockLecture } from "../../../services/mocks/api";
import { MyRadio } from "../../../components/Radio/MyRadio";
import { MyErrorText } from "../../../components/Text/MyErrorText";
//import { ILectureFormData } from "../../../../typings/LectureRegister";

function LectureRegister(): React.ReactElement {
  const [_img, setImg] = useState<string>("");
  const [_videos, setVideos] = useState<string[]>([]);
  const [submitFlag, setSubmitFlag] = useState(false);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm();

  const {
    acceptedFiles: videoFiles,
    getRootProps: getVideoRootProps,
    getInputProps: getVideoInputProps,
  } = useDropzone({
    accept: { "video/*": videoTypes },
    onDrop: (acceptedFiles: File[]) => {
      const isRightType = acceptedFiles
        .map((file: File) => file.type.replace("video/", ""))
        .some((elem) => videoTypes.includes("." + elem));

      if (!isRightType) {
        alert(
          "비디오 파일만 등록이 가능합니다! \n(mp4, mov, wmv, avi, mkv, webm)"
        );
      }
    },
  });

  const {
    acceptedFiles: imgFile,
    getRootProps: getImgRootProps,
    getInputProps: getImgInputProps,
  } = useDropzone({
    maxFiles: 1,
    accept: { "image/*": imgTypes },
    onDrop: (acceptedFiles: File[]) => {
      const isRightType = acceptedFiles
        .map((file: File) => file.type.replace("image/", ""))
        .some((elem) => imgTypes.includes("." + elem));

      if (!isRightType || acceptedFiles.length > 1) {
        alert("이미지 파일 하나만 등록이 가능합니다! \n(jpg, png, jpeg, webp)");
      }
    },
  });

  const registerMutate = useMutation<unknown, Error, FieldValues>(
    postMockLecture,
    {
      onSuccess(data) {
        console.log("success", data);
      },
      onError(error) {
        console.log("fail", error);
      },
    }
  );

  const onSubmit = (formData: FieldValues) => {
    console.log("formData", {
      ...formData,
      thumbnail: _img,
      videos: _videos,
    });
    registerMutate.mutate(formData);

    // create image url => new Image(img,url) => imgUrl
    // create video url => new Video(video,url) => videoUrl

    // process data
    // post
  };

  async function handleVideoChange() {
    const newVideos = await Promise.all(videoFiles.map(createVideoThumbnail));
    setVideos(newVideos);
  }

  const img = imgFile.map((file: File, idx: number) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImg(getSecureImgFile(reader.result));
    };
    reader.readAsDataURL(file);
    return (
      <HStack alignItems={"flex-start"} key={idx}>
        <ChakraImg w="200px" h="150px" src={_img} />
        <Text>
          {file.name} - {file.size} bytes
        </Text>
      </HStack>
    );
  });

  const videos = videoFiles.map((file: File, idx: number) => {
    return (
      <Box mb="3" w="50%" key={idx}>
        <Text>
          {file.name} - {file.size} bytes
        </Text>
        <Input
          mt="4"
          mb="1"
          type="text"
          maxLength={30}
          placeholder="제목을 입력해주세요"
          className={css.Input}
          {...register(`videoTitle[${idx}]`, {
            required: { value: true, message: "제목을 입력해주세요" },
            maxLength: {
              value: 30,
              message: "최대 30 자까지 가능합니다",
            },
          })}
        />
        {submitFlag && !watch(`videoTitle[${idx}]`) ? (
          <MyErrorText message="제목을 입력해주세요" />
        ) : null}
        <Input
          type="text"
          maxLength={300}
          placeholder="설명을 입력해주세요"
          className={css.Input}
          {...register(`videoDescription[${idx}]`, {
            required: { value: true, message: "설명을 입력해주세요" },
            maxLength: {
              value: 300,
              message: "최대 300 자까지 가능합니다",
            },
          })}
        />
        {submitFlag && !watch(`videoDescription[${idx}]`) ? (
          <MyErrorText message="설명을 입력해주세요" />
        ) : null}
      </Box>
    );
  });

  useDidMountEffect(() => {
    handleVideoChange();
  }, [videoFiles]);

  return (
    <VStack alignItems={"flex-start"} ml="10">
      <Text fontWeight={"bold"} fontSize={"35px"} mb="10">
        강의 등록
      </Text>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "500px" }}>
        <FormControl
          isInvalid={!!errors["lectureTitle"]}
          id={"lectureTitle"}
          mb="5"
        >
          <FormLabel fontWeight={"bold"} id="lectureTitle">
            강의명 ({`${watch("lectureTitle")?.length} / 30`})
          </FormLabel>
          <input
            type="text"
            className={css.Input}
            aria-labelledby="lectureTitle"
            placeholder="강의명을 입력해주세요"
            maxLength={30}
            {...register("lectureTitle", {
              required: { value: true, message: "강의명을 입력해주세요" },
              maxLength: { value: 30, message: "최대 30 자까지 가능합니다" },
            })}
          />
          {errors["lectureTitle"] && (
            <FormErrorMessage>
              {typeof errors["lectureTitle"].message === "string" &&
                errors["lectureTitle"].message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          isInvalid={!!errors["lectureFee"]}
          id={"lectureFee"}
          my="5"
        >
          <FormLabel fontWeight={"bold"} id={"lectureFee"}>
            가격
          </FormLabel>
          <input
            type="number"
            className={css.Input}
            aria-labelledby="lectureFee"
            placeholder="가격을 입력해주세요"
            {...register("lectureFee", {
              required: { value: true, message: "가격을 입력해주세요" },
              min: { value: 0, message: "최소 0원 이상부터 등록 가능합니다" },
              max: {
                value: 1000000,
                message: "최대 100만원까지 등록 가능합니다",
              },
            })}
          />
          {errors["lectureFee"] && (
            <FormErrorMessage>
              {typeof errors["lectureFee"].message === "string" &&
                errors["lectureFee"].message}
            </FormErrorMessage>
          )}
        </FormControl>
        <FormControl
          isInvalid={!!errors["lectureDescription"]}
          id={"lectureDescription"}
          my="5"
        >
          <FormLabel fontWeight={"bold"} id={"lectureDescription"}>
            설명 ({`${watch("lectureDescription")?.length} / 1000`})
          </FormLabel>
          <textarea
            className={css.TextArea}
            aria-labelledby="lectureDescription"
            placeholder="설명을 입력해주세요"
            maxLength={1000}
            {...register("lectureDescription", {
              required: { value: true, message: "설명을 입력해주세요" },
              maxLength: {
                value: 1000,
                message: "최대 1000 자까지 가능합니다",
              },
            })}
          />
          {errors["lectureDescription"] && (
            <FormErrorMessage>
              {typeof errors["lectureDescription"].message === "string" &&
                errors["lectureDescription"].message}
            </FormErrorMessage>
          )}
        </FormControl>
        <Divider my="5" mt="10" />
        <FormControl
          isInvalid={!!errors["lectureImg"]}
          id={"lectureImg"}
          my="8"
        >
          <FormLabel fontWeight={"bold"} id={"lectureImg"}>
            대표 이미지 올리기
          </FormLabel>
          <VStack
            backgroundColor={"#fafafa"}
            border="1px dashed gray"
            cursor="pointer"
            p="10"
            {...getImgRootProps({ className: "dropzone" })}
          >
            <input {...getImgInputProps()} aria-labelledby="lectureImg" />
            <p style={{ color: "#777" }}>
              이미지는 클릭 또는 드래그해서 올려주세요 <br />
              (jpg, png, jpeg, webp)
            </p>
          </VStack>
          <aside>
            <Text fontWeight={"bold"} mt="6" mb="2">
              이미지파일
            </Text>
            {img}
          </aside>
          {!submitFlag
            ? null
            : !(_img.length > 0) && (
                <MyErrorText message="대표 이미지를 등록해주세요" />
              )}
        </FormControl>
        <Divider my="5" />
        <FormControl
          isInvalid={!!errors["lectureVideos"]}
          id={"lectureVideos"}
          my="8"
        >
          <FormLabel fontWeight={"bold"} id={"lectureVideos"}>
            영상 올리기
          </FormLabel>
          <VStack
            backgroundColor={"#fafafa"}
            border="1px dashed gray"
            cursor="pointer"
            p="10"
            {...getVideoRootProps({ className: "dropzone" })}
          >
            <input {...getVideoInputProps()} aria-labelledby="lectureVideos" />
            <p style={{ color: "#777" }}>
              영상은 클릭 또는 드래그해서 올려주세요 <br /> (mp4, mov, wmv, avi,
              mkv, webm)
            </p>
          </VStack>
          <aside>
            <Text fontWeight={"bold"} mt="6" mb="2">
              영상파일 ({videoFiles?.length})
            </Text>
            <List>
              {videos.map((item, idx) => {
                return (
                  <ListItem key={idx} mt="6">
                    <HStack w="100%" spacing={6}>
                      {item}
                      <ChakraImg
                        w="200px"
                        h="150px"
                        src={_videos[idx]}
                        border="1px solid gray"
                      />
                    </HStack>
                  </ListItem>
                );
              })}
            </List>
          </aside>
          {!submitFlag
            ? null
            : _videos.length <= 0 && (
                <MyErrorText message="강의 영상을 등록해주세요" />
              )}
        </FormControl>
        <Divider my="5" />
        <FormControl
          isInvalid={!!errors["targetAudience"]}
          id={"targetAudience"}
          w="100%"
          my="7"
        >
          <FormLabel fontWeight={"bold"} id={"targetAudience"}>
            목적
          </FormLabel>
          <RadioGroup
            display={"flex"}
            pl="5"
            name="targetAudience"
            aria-labelledby="targetAudience"
          >
            <MyRadio
              value="theory"
              testId="target1"
              {...register("targetAudience", { required: true })}
            >
              이론
            </MyRadio>
            <MyRadio
              ml="2"
              value="training"
              testId="target2"
              {...register("targetAudience", { required: true })}
            >
              실습
            </MyRadio>
          </RadioGroup>
          <FormErrorMessage>{`${"목적"}을 선택해주세요`}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={!!errors["lectureDifficulty"]}
          id={"lectureDifficulty"}
          my="7"
        >
          <FormLabel fontWeight={"bold"} id={"lectureDifficulty"}>
            난이도
          </FormLabel>
          <RadioGroup
            pl="5"
            display={"flex"}
            name="lectureDifficulty"
            aria-labelledby="lectureDifficulty"
          >
            <MyRadio
              value="start"
              testId="difficulty1"
              {...register("lectureDifficulty", { required: true })}
            >
              입문
            </MyRadio>
            <MyRadio
              ml="2"
              value="lower"
              testId="difficulty2"
              {...register("lectureDifficulty", { required: true })}
            >
              초급
            </MyRadio>
            <MyRadio
              ml="2"
              value="middle"
              testId="difficulty3"
              {...register("lectureDifficulty", { required: true })}
            >
              중급
            </MyRadio>
            <MyRadio
              ml="2"
              value="upper"
              testId="difficulty4"
              {...register("lectureDifficulty", { required: true })}
            >
              고급
            </MyRadio>
          </RadioGroup>
          <FormErrorMessage>{`${"난이도"}를 선택해주세요`}</FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={!!errors["categories"]}
          id={"categories"}
          my="7"
        >
          <FormLabel fontWeight={"bold"} htmlFor="categories" id="categories">
            카테고리
          </FormLabel>
          <RadioGroup
            pl="5"
            id="categories"
            display={"flex"}
            name="categories"
            aria-labelledby="categories"
          >
            <VStack w="100%" alignItems={"flex-start"}>
              <HStack w="100%" my="3">
                <MyRadio
                  value="html"
                  testId="categories1"
                  {...register("categories", { required: true })}
                >
                  HTML
                </MyRadio>
                <MyRadio
                  ml="2"
                  value="css"
                  testId="categories2"
                  {...register("categories", { required: true })}
                >
                  CSS
                </MyRadio>
                <MyRadio
                  ml="2"
                  value="react"
                  testId="categories3"
                  {...register("categories", { required: true })}
                >
                  REACT
                </MyRadio>
                <MyRadio
                  ml="2"
                  value="vue"
                  testId="categories4"
                  {...register("categories", { required: true })}
                >
                  VUE
                </MyRadio>
              </HStack>
              <HStack w="100%">
                <MyRadio
                  value="spring"
                  testId="categories5"
                  {...register("categories", { required: true })}
                >
                  SPRING
                </MyRadio>
                <MyRadio
                  ml="2"
                  value="django"
                  testId="categories6"
                  {...register("categories", { required: true })}
                >
                  DJANGO
                </MyRadio>
                <MyRadio
                  ml="2"
                  value="swift"
                  testId="categories7"
                  {...register("categories", { required: true })}
                >
                  SWIFT
                </MyRadio>
                <MyRadio
                  ml="2"
                  value="android"
                  testId="categories8"
                  {...register("categories", { required: true })}
                >
                  ANDROID
                </MyRadio>
              </HStack>
            </VStack>
          </RadioGroup>
          <FormErrorMessage>{`${"카테고리"}를 선택해주세요`}</FormErrorMessage>
        </FormControl>
        <Button
          w="500px"
          type="submit"
          colorScheme="facebook"
          onClick={() => setSubmitFlag(true)}
        >
          등록하기
        </Button>
      </form>
    </VStack>
  );
}

export default LectureRegister;