// ----- DOG -----
const modelPlayfulDog = document.getElementById("model-playful-dog");
const animationsList = ["standing", "sitting", "shake", "rollover", "play_dead"];
const changeAnimationButton = document.getElementById("change-animation");

let index = 1;
const changeAnimation = () => {
    modelPlayfulDog.setAttribute("animation-name", animationsList[index]);
    index = (index + 1) % animationsList.length;
};

changeAnimationButton.addEventListener("click", changeAnimation, false);

// ----- COUCH -----
const modelCouch = document.getElementById("model-couch");
const modelsSelector = document.getElementById("models-selector");
const modelsUrlMap = {
    LivingAlicante2Plazas: "./assets/LivingAlicante2Plazas",
    LivingEsquineroMeloAzulClaro: "./assets/LivingEsquineroMeloAzulClaro",
    LivingLara: "./assets/LivingLara"
};

const changeModel = () => {
    const currentModel = modelsSelector.value;
    const currentModelGlb = `${modelsUrlMap[currentModel]}.glb`;
    const currentModelUsdz = `${modelsUrlMap[currentModel]}.usdz`;

    modelCouch.setAttribute("src", currentModelGlb);
    modelCouch.setAttribute("ios-src", currentModelUsdz);
};

modelsSelector.addEventListener("change", changeModel, false);