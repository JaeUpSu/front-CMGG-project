import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { Lecture, PayProps } from "../../../../../typings/PaymentResult";

interface ProcessLectures {
  id: string[];
  title: string[];
  thumbnail: string[];
  instructor: string[];
}

function processLecture(lectures: Lecture[]): string {
  let result = "";
  let processedLectures: ProcessLectures = {
    id: [],
    title: [],
    thumbnail: [],
    instructor: [],
  };

  lectures.map((item, idx) => {
    processedLectures["title"].push(item.title);
    processedLectures["thumbnail"].push(item.thumbnail);
    processedLectures["instructor"].push(item.instructor);
    processedLectures["id"].push(item.id.toString());
  });

  result = processedLectures["id"].join(",");
  result += "^@^" + processedLectures["title"].join(",");
  result += "^@^" + processedLectures["thumbnail"].join(",");
  result += "^@^" + processedLectures["instructor"].join(",");

  return result;
}

export function RequestPayment(props: PayProps): React.ReactElement {
  const navigate = useNavigate();
  const requestPay = () => {
    if (!window.IMP) return;
    var IMP = window.IMP;
    IMP.init("imp21417627");

    var today = new Date();
    var hours = today.getHours(); // 시
    var minutes = today.getMinutes(); // 분
    var seconds = today.getSeconds(); // 초
    var milliseconds = today.getMilliseconds();
    var makeMerchantUid = hours + minutes + seconds + milliseconds;
    IMP.request_pay(
      {
        pg: "tosspayments",
        pay_method: "card",
        merchant_uid: "IMP" + makeMerchantUid,
        name: props.name,
        amount: props.amount,
        buyer_email: props.buyer_email,
        buyer_name: props.buyer_name,
        buyer_tel: props.buyer_tel,
        display: {
          card_quota: [3], // 할부개월 3개월까지 활성화
        },
      },
      function (rsp) {
        // callback
        if (!rsp.error_code) {
          const buyedLectures = processLecture(props.lectures);
          sessionStorage.setItem("buy_lectures", buyedLectures);
          sessionStorage.setItem("buy_username", props.buyer_name);
          navigate("/wasBuyed");
        }
      }
    );
  };
  return <Button onClick={requestPay}>구매하기</Button>;
}
