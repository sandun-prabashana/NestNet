document.addEventListener('mouseover', function (e) {
    if (e.target.closest('#star-rating')) {
      const star = e.target;
      if (star.tagName === 'SPAN') {
        star.classList.add('selected');
        star.previousElementSibling && star.previousElementSibling.classList.add('selected');
        star.nextElementSibling && star.nextElementSibling.classList.remove('selected');
      }
    }
  });
  
  document.addEventListener('click', function (e) {
    if (e.target.closest('#star-rating')) {
      const star = e.target;
      if (star.tagName === 'SPAN') {
        const allStars = document.querySelectorAll('#star-rating span');
        allStars.forEach((s) => s.classList.remove('selected'));
        star.classList.add('selected');
        star.previousElementSibling && star.previousElementSibling.classList.add('selected');
      }
    }
  });
  