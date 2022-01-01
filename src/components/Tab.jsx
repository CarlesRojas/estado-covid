import React, { useRef, useContext, useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";
import { Utils } from "../contexts/Utils";
import { Events } from "../contexts/Events";
import { GlobalState } from "../contexts/GlobalState";
import classnames from "classnames";
import CovidData from "./CovidData";
import SVG from "react-inlinesvg";

import UpIcon from "../resources/icons/up.svg";
import LocationIcon from "../resources/icons/location.svg";
import LanguageIcon from "../resources/icons/lang.svg";
import Button from "./Button";

const HIDDEN_PERCENTAGE = 0.67;

export default function Tab() {
    // console.log("Render Tab");

    const { lerp, invlerp } = useContext(Utils);
    const { EVENT_LIST, emit } = useContext(Events);
    const { STATE, set } = useContext(GlobalState);

    const [showButtons, setShowButtons] = useState(true);

    // #################################################
    //   ACTIONS
    // #################################################

    const isHidden = useRef(true);
    const [{ y }, spring] = useSpring(() => ({ y: `${HIDDEN_PERCENTAGE * 100}%` }));

    const hideContainer = () => {
        isHidden.current = true;
        setShowButtons(true);
        spring.start({ y: `${HIDDEN_PERCENTAGE * 100}%` });
    };

    const showContainer = () => {
        isHidden.current = false;
        if (showButtons) setShowButtons(false);
        spring.start({ y: "0%" });
    };

    // #################################################
    //   GESTURE
    // #################################################

    const continerRef = useRef(null);

    // Vertical gesture
    const gestureBind = useDrag(
        ({ first, event, down, vxvy: [, vy], movement: [, my] }) => {
            // Stop event propagation
            event.stopPropagation();

            if (first) setShowButtons(false);

            var containerHeight = continerRef.current.offsetHeight;

            // Snap to hide or show
            if (!down) {
                if ((my > containerHeight * 0.1 && vy >= 0) || vy > 1) hideContainer();
                else if ((my < -containerHeight * 0.1 && vy <= 0) || vy < -1) showContainer();
                else if (isHidden.current) hideContainer();
                else showContainer();
            }

            // Update the position while the gesture is active
            else {
                var displ = isHidden.current
                    ? invlerp(-containerHeight * HIDDEN_PERCENTAGE, 0, my)
                    : invlerp(0, containerHeight * HIDDEN_PERCENTAGE, my);
                var percentageDispl = lerp(0, HIDDEN_PERCENTAGE * 100, displ);
                spring.start({ y: `${percentageDispl}%` });
            }
        },
        { filterTaps: true, axis: "y" }
    );

    const [headerheight, setHeaderheight] = useState(null);

    useEffect(() => {
        setHeaderheight(continerRef.current.getBoundingClientRect().height * (1 - HIDDEN_PERCENTAGE));
    }, []);

    return (
        <div className="tab">
            <animated.div className="container" ref={continerRef} {...gestureBind()} style={{ y }}>
                <Button
                    extraClass={`locationIconContainer ${!showButtons ? "hidden" : ""}`}
                    onClick={() => set(STATE.languagePopupVisible, true)}
                    svg={LanguageIcon}
                />

                <Button
                    extraClass={`locationIconContainer right ${!showButtons ? "hidden" : ""}`}
                    onClick={() => emit(EVENT_LIST.ON_CENTER_ON_CURRENT_LOCATION)}
                    svg={LocationIcon}
                />

                <div className={classnames("upIconContainer", { hidden: !showButtons })}>
                    <SVG className="upIcon" src={UpIcon} onClick={showContainer} />
                </div>

                {headerheight && <CovidData headerHeight={headerheight} />}
            </animated.div>
        </div>
    );
}
