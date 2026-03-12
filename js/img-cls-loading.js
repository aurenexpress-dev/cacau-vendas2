const getAllStyles = (element, width, height) => {
  if (!element) return {}; // Element does not exist, empty list.
  var win = document.defaultView || window,
    styl = [];
  var styleNode = {};
  if (win.getComputedStyle) {
    /* Modern browsers */
    style = win.getComputedStyle(element, '');
    for (var i = 0; i < style.length; i++) {
      styleNode[style[i]] = style.getPropertyValue(style[i]);
      //               ^name ^           ^ value ^
    }
  } else if (element.currentStyle) {
    /* IE */
    style = element.currentStyle;
    for (var name in style) {
      styleNode[style[i]] = style[name];
    }
  } else {
    /* Ancient browser..*/
    style = element.style;
    for (var i = 0; i < style.length; i++) {
      styleNode[style[i]] = style[style[i]];
    }
  }

  styleNode.width = styleNode.width === '0px' ? `${width}px` : styleNode.width;
  styleNode.height = styleNode.height === '0px' ? `${height}px` : styleNode.height;

  return styleNode;
};

const getMargins = (imgStyles = false) => imgStyles !== false ? `margin-left:${imgStyles['margin-left']};margin-top:${imgStyles['margin-top']};margin-right:${imgStyles['margin-right']};margin-bottom:${imgStyles['margin-bottom']};` : 'margin-left:0px !important;margin-top:0px !important;margin-right:0px !important;margin-bottom:0px !important;';

const getBorderRadius = (imgStyles = false) => imgStyles !== false ? `border-bottom-left-radius:${imgStyles['border-bottom-left-radius']};border-bottom-right-radius:${imgStyles['border-bottom-right-radius']};border-end-end-radius:${imgStyles['border-end-end-radius']};border-end-start-radius:${imgStyles['border-end-start-radius']};border-start-end-radius:${imgStyles['border-start-end-radius']};border-start-start-radius:${imgStyles['border-start-start-radius']};border-top-left-radius:${imgStyles['border-top-left-radius']};border-top-right-radius:${imgStyles['border-top-right-radius']};` : '';

const getPercentage = (width, height, reference, metric) => (metric === 'width' || metric === 'max-width') ? parseFloat(reference) * 100 / width : parseFloat(reference) * 100 / height;

const getSpecificSize = (width, height, imgStyles, metric, previousValue = []) => {
  const reference = imgStyles[metric];
  if (reference !== 'none') {
    let loaderWidth, loaderHeight;
    if ((reference.search('px') >= 0 && reference !== '0px') || (reference.search('%') >= 0 && previousValue.length === 0)) {
      const percentage = getPercentage(width, height, reference, metric);
      loaderWidth = width * (percentage / 100);
      loaderHeight = height * (percentage / 100);

      return [loaderWidth, loaderHeight, reference.search('%') >= 0 ? '%' : 'px', metric];
    }
  }

  return previousValue;
};

const getSize = (width, height, imgStyles) => {
  let size = [];
  ['max-height', 'max-width', 'height', 'width'].forEach((metric) => {
    size = getSpecificSize(width, height, imgStyles, metric, size);
  });
  return size;
};

const placeholderAnimationCleaner = (element, size) => {
  // element.parentElement.removeAttribute("class");
  // element.parentElement.removeAttribute("style"); 
  element.setAttribute("style", size);
}

Object.values(document.getElementsByTagName('img')).forEach((img) => {

  if (img.getAttribute('data-placeholder')) {
    const [width, height] = img.getAttribute('data-placeholder').split('-')[1].split('x');
    const imgStyles = getAllStyles(img, width, height);

    let [loaderWidth, loaderHeight, symbol, metric] = getSize(width, height, imgStyles);
    if (symbol === '%') {
      let size;
      if (metric === 'width' || metric === 'max-width') {
        size = img.parentElement.clientWidth;
      } else {
        size = img.parentElement.clientHeight;
      }
      const percentage = getPercentage(width, height, size, metric);
      loaderWidth = width * (percentage / 100);
      loaderHeight = height * (percentage / 100);
      symbol = 'px';
    }

    if (width == 85 && height == 85) {
      loaderWidth = 85;
      loaderHeight = 85;
      symbol = 'px';
    }

    const imgSize = `width:${loaderWidth}${symbol};height:${loaderHeight}${symbol};`;
    const imgAnimation = 'animation-delay: 1000ms;animation-direction: alternate;animation-duration: 1s;animation-iteration-count: 1.0;animation-name: image-opacity;animation-timing-function: steps(10,end);';

    img.setAttribute('loading', `lazy`);
    // img.setAttribute('onload', `placeholderAnimationCleaner(this, '${imgSize}');`);
    // img.setAttribute('style', `${imgSize + imgAnimation}background-color: #BDBDBD;`); 
  }
});
