import React, { useContext } from "react";
import classnames from "classnames";
import { Data } from "../contexts/Data";
import { Language } from "../contexts/Language";

export default function Graph({ provinceId, provinceName, date }) {
    const { covidDataProvinces } = useContext(Data);
    const { language } = useContext(Language);

    const realDate = date ? date : 0;
    const last14Days = covidDataProvinces.current.slice(-14);

    var maxData = Number.MIN_VALUE;
    const data = last14Days.map((dayData) => {
        const value = dayData[provinceId].activeCovidCasesPerCapita * 100;
        maxData = Math.max(maxData, value);
        return value;
    });

    return (
        <div className="graph">
            <p className="axisLabel">{language.graph_axisLabel(provinceName)}</p>
            <div className="graphContainer">
                <div className="pointsContainer">
                    {data.map((elem, i) => (
                        <div className="bar" key={i} style={{ height: `${100 - (elem / maxData) * 100}%` }}>
                            <div className={classnames("point", { current: 13 - i === realDate })}>
                                {13 - i === realDate ? (
                                    <p className="max">{`${elem.toFixed(2).toLocaleString(language.locale)}%`}</p>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <p className="axisLabel bottom">{language.graph_axisLabelBottom}</p>
        </div>
    );
}
