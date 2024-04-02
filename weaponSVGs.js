let weaponSVGs = {
    pistol(color,translateX,scaleX) {
        return `
        <svg class="weapon" style="transform: translate(${translateX}%,0) scaleX(${scaleX})" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370.12 277.69">
            <rect style="fill:${color}" y="121.51" width="105.58" height="156.18" filter="url(#neon)"/>
            <rect style="fill:${color}" width="370.12" height="121.51" filter="url(#neon)"/>
        </svg>`
    }
    
}