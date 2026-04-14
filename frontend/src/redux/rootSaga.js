import { spawn } from 'redux-saga/effects';

import { commonSagas } from '../pages/admin/common/sagas';
import { courseSagas } from '../pages/admin/course/sagas';
import { courseContentSagas } from '../pages/admin/course/courseContentSagas';
import { userSagas } from '../pages/admin/user/sagas';
import { courseCategorySagas } from '../pages/admin/courseCategory/sagas';
import { gallerySagas } from '../pages/admin/gallery/sagas';
import { termsAndConditionsSagas } from '../pages/admin/terms/sagas';

// Public Sagas
import { homeSaga } from '../pages/user/home/saga';
import { aboutSaga } from '../pages/user/about/saga';
import { contactSaga } from '../pages/user/contact/saga';
import { faqSaga } from '../pages/user/faq/saga';
import { termsSaga } from '../pages/user/terms/saga';
import { policySaga } from '../pages/user/policy/saga';
import { coursesSaga } from '../pages/user/courses/saga';

// New Admin Sagas
import { offlineBatchSagas } from '../pages/admin/offlineBatch/saga';
import { faqSagas } from '../pages/admin/faq/saga';
import { aboutSectionSagas } from '../pages/admin/aboutSection/saga';
import { privacyPolicySagas } from '../pages/admin/privacyPolicy/saga';
import { courseRatingSagas } from '../pages/admin/courseRating/saga';
import { platformRatingSagas } from '../pages/admin/platformRating/saga';

function* rootSaga() {
  yield spawn(commonSagas);
  yield spawn(courseSagas);
  yield spawn(courseContentSagas);
  yield spawn(userSagas);
  yield spawn(courseCategorySagas);
  yield spawn(gallerySagas);
  yield spawn(termsAndConditionsSagas);
  yield spawn(offlineBatchSagas);
  yield spawn(faqSagas);
  yield spawn(aboutSectionSagas);
  yield spawn(privacyPolicySagas);
  yield spawn(courseRatingSagas);
  yield spawn(platformRatingSagas);

  // Public
  yield spawn(homeSaga);
  yield spawn(aboutSaga);
  yield spawn(contactSaga);
  yield spawn(faqSaga);
  yield spawn(termsSaga);
  yield spawn(policySaga);
  yield spawn(coursesSaga);
}

export default rootSaga;
