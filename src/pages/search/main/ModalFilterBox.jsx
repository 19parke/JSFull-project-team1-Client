import React, { useEffect, useRef, useState } from 'react';
import S from './style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBath, faBed, faHouse, faUser, faXmark } from '@fortawesome/free-solid-svg-icons';

import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { createSearchParams, useSearchParams } from 'react-router-dom';
import BasicButton from '../../../components/button/BasicButton';


const ModalFilterBox = ({searchParams, setSearchParams, isFilterActivate, 
    handleFilterStatus, contentData, setContentData, setMaxPage,
    setSearchResultMessage, setRoomsCount, roomsCount}) => {

    //  백그라운드만 클릭했을 때 닫히게
    const backgroundClick = () => {
        window.addEventListener("click", (e) => {
            if (e.target.classList.contains("filterBg")) {
                handleFilterStatus();
            }
        });

    };

    const getKey = searchParams.get('cate'); // 카테고리 params 가져오기
    const getPrice = [searchParams.get("lPrice"),searchParams.get("gPrice")]; // 가격범위 params 가져오기
    const getMaxUser = searchParams.get("maxUser"); // 최대인원 params 가져오기
    const getBedroom = searchParams.get("bedroom"); // 침실 params 가져오기
    const getBed = searchParams.get("bed"); // 침대 params 가져오기
    const getBathroom = searchParams.get("bathroom"); // 욕실 params 가져오기
    const [value, setValue] = useState([getPrice[0]? getPrice[0]: 10000, getPrice[1]? getPrice[1]: 1000000]); // 가격범위 초기세팅을 params로 세팅
    const [maxUser, setMaxUser] = useState(getMaxUser); // 최대인원 초기세팅을 params로 세팅
    const [bedroom, setBedroom] = useState(getBedroom); // 침실 초기세팅을 params로 세팅
    const [bed, setBed] = useState(getBed); // 침대 초기세팅을 params로 세팅
    const [bathroom, setBathroom] = useState(getBathroom); // 욕실 초기세팅을 params로 세팅
    const val0Ref = useRef(0); // 최소가격 input 참조
    const val1Ref = useRef(0); // 최대가격 input 참조
    const numBoxRef = useRef(null); // 최대인원박스 참조
    const bedroomBoxRef = useRef(null); // 최대침실박스 참조
    const bedBoxRef = useRef(null); // 최대침대박스 참조
    const bathroomBoxRef = useRef(null); // 최대욕조박스 참조
    const setVal = () => { // 가격범위 값 조건 함수
        setValue([val0Ref.current.value, val1Ref.current.value]); // 가격범위 값을 참조 input값으로 설정
    }
    const numberBtnClick = (e) => { // 최대 인원 버튼 조건 함수
        setMaxUser(e.target.value); // 클릭한 radio의 value값으로 최대 인원 조건 세팅
    }
    const bedroomBtnClick = (e) => { // 최대 침실 버튼 조건 함수
        setBedroom(e.target.value); // 클릭한 radio의 value값으로 최대 침실 조건 세팅
    }
    const bedBtnClick = (e) => { // 최대 침대 버튼 조건 함수
        setBed(e.target.value); // 클릭한 radio의 value값으로 최대 침대 조건 세팅
    }
    const bathroomBtnClick = (e) => { // 최대 욕실 버튼 조건 함수
        setBathroom(e.target.value); // 클릭한 radio의 value값으로 최대 욕실 조건 세팅
    }
    const resetCondition = () => { // 조건 리셋 함수
        setValue([0,1000000]); // 가격조건 0 , 100만으로 초기화
        setMaxUser(0); // 최대인원 0으로 초기화
        numBoxRef.current.children[0].checked = true; // 최대인원 "상관없음" 체크
        setBedroom(0); // 최대침실 0으로 초기화
        bedroomBoxRef.current.children[0].checked = true; // 최대침실 "상관없음" 체크
        setBed(0); // 최대침대 0으로 초기화
        bedBoxRef.current.children[0].checked = true; // 최대침대 "상관없음" 체크
        setBathroom(0); // 최대욕실 0으로 초기화
        bathroomBoxRef.current.children[0].checked = true; // 최대욕실 "상관없음" 체크
    }
    
    const filtered = contentData.filter((room)=>
        room.dayPrice>= value[0] &&
        room.dayPrice<= value[1] &&
        room.roomData.maxUser>= maxUser &&
        room.roomData.bedroom>= bedroom &&
        room.roomData.bed>= bed &&
        room.roomData.bathroom>= bathroom
    )
    const viewFiltered = () => {
        // console.log(getKey, value[0], value[1], maxUser, bedroom, bed, bathroom);
        const params = createSearchParams({cate: getKey, lPrice: value[0], gPrice: value[1], maxUser: maxUser, bedroom: bedroom, bed: bed, bathroom: bathroom})
        setSearchParams(params);

        // 조건 초기화
        resetCondition();
        // 모달 닫기
        handleFilterStatus();
    }


    useEffect(() => {
        // 숙소 요청
        const getRoomList = async () => {
            const response = await fetch(`http://localhost:8000/room/search?${searchParams}`);
            const rooms = await response.json();

            return rooms;
        };
        getRoomList()
        .then((res) => {
            if (!res.searchResult) {
                // 검색결과 없거나 서버와 통신 안된다는 메시지 받아서 설정
                setSearchResultMessage(res.message);
            } else {
                // 숙소 전체 결과 개수
                setRoomsCount(res.roomsCount);

                // 페이지 당 표시할 숙소로 나눠서 최대 페이지 설정
                setMaxPage(Math.floor(res.roomsCount / 18) + 1);
                
                // body 스크롤 초기화
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            // 숙소 결과 상태에 담기
            setContentData(res.rooms);
        })
        .catch((err) => {
            console.error(err);
            setSearchResultMessage("서버와 통신 실패");
        });
    }, []);



    return (
        <S.ModalFilter className={ isFilterActivate ? "filterBg" : "" } onClick={backgroundClick}>
            <S.Popup>
                <div className="filterHeader">
                    <div className="closeBtn" onClick={handleFilterStatus}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </div>
                    <h6>필터</h6>
                </div>

                <div className="filterListBox">
                    <div className="priceFilter">
                        <h6>가격 범위</h6>
                        <RangeSlider
                            className="range-slider-yellow"
                            value={value}
                            onInput={setValue}
                            onThumbDragEnd={setVal}
                            rangeSlideDisabled={true}
                            min={10000}
                            max={1000000}
                            step={1000}
                        />
                        <div className="priceText">
                            <div>
                                <span>최소</span>
                                <input type="text" ref={val0Ref} onChange={setVal} value={value[0]}/>
                            </div>
                            <div>
                                <span>최대</span>
                                <input type="text" ref={val1Ref} onChange={setVal} value={value[1]}/>
                            </div>
                        </div>
                    </div>

                    <div className="roomFilter">
                        <h6>기타 조건</h6>
                        <div className="filterList">
                            <ul>
                                <li>
                                    <p><FontAwesomeIcon icon={faUser}/>최대 인원</p>
                                    <div className='numberBtnBox' ref={numBoxRef}>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={0} label={"상관없음"} defaultChecked/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={1} label={"1"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={2} label={"2"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={3} label={"3"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={4} label={"4"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={5} label={"5"}/>
                                        <input type="radio"  onClick={numberBtnClick} name='maxUser' value={6} label={"6+"}/>
                                    </div>
                                </li>
                                <li>
                                    <p><FontAwesomeIcon icon={faHouse}/>침실</p>
                                    <div className='numberBtnBox' ref={bedroomBoxRef}>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={0} label={"상관없음"} defaultChecked/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={1} label={"1"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={2} label={"2"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={3} label={"3"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={4} label={"4"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={5} label={"5"}/>
                                        <input type="radio" onClick={bedroomBtnClick} name='bedroom' value={6} label={"6+"}/>
                                    </div>
                                </li>
                                <li>
                                    <p><FontAwesomeIcon icon={faBed}/>침대</p>
                                    <div className='numberBtnBox' ref={bedBoxRef}>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={0} label={"상관없음"} defaultChecked/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={1} label={"1"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={2} label={"2"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={3} label={"3"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={4} label={"4"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={5} label={"5"}/>
                                        <input type="radio" onClick={bedBtnClick} name='bed' value={6} label={"6+"}/>
                                    </div>
                                </li>
                                <li>
                                    <p><FontAwesomeIcon icon={faBath}/>욕실</p>
                                    <div className='numberBtnBox' ref={bathroomBoxRef}>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={0} label={"상관없음"} defaultChecked/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={1} label={"1"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={2} label={"2"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={3} label={"3"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={4} label={"4"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={5} label={"5"}/>
                                        <input type="radio" onClick={bathroomBtnClick} name='bath' value={6} label={"6+"}/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bottomBox">
                    <div className="filterRemoveBox">
                        <button type='bottom' className='filterRemoveBtn' onClick={resetCondition}>전체 해제</button>
                    </div>
                    <div className="filterSubmitBox">
                        <BasicButton className='filterSubmitBtn' onClick={viewFiltered}>숙소 {roomsCount}개 보기</BasicButton>
                    </div>
                </div>
            </S.Popup>
        </S.ModalFilter>
    );
};

export default ModalFilterBox;