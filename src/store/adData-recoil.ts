import { atom } from "recoil";

// adDataState atom 정의
export const adDataState = atom<{ uid: string | null; cid: string | null; adid: string | null }>({
  key: 'adDataState',
  default: {
      uid: null,
      cid: null,
      adid: null,
  },
  effects_UNSTABLE: [
      ({ setSelf, onSet }) => {
          // 새로고침 시 기존 데이터를 불러오기
          const savedAdData = localStorage.getItem('adData');
          if (savedAdData) {
              setSelf(JSON.parse(savedAdData));
          }

          // 상태 변경 시 localStorage에 저장
          onSet((newAdData) => {
              localStorage.setItem('adData', JSON.stringify(newAdData));
          });
      },
  ],
});