const DOMAIN = 'http://localhost:8001'; // V2 서버 포트

// Tasks V2
const GET_TASKS_V2_API_URL = `${DOMAIN}/get_tasks_v2`;
const POST_TASK_V2_API_URL = `${DOMAIN}/post_task_v2`;
const UPDATE_COMPLETED_TASK_V2_API_URL = `${DOMAIN}/update_completed_task_v2`;
const DELETE_TASK_V2_API_URL = `${DOMAIN}/delete_task_v2`;
const UPDATE_TASK_V2_API_URL = `${DOMAIN}/update_task_v2`;

// Categories V2
const GET_CATEGORIES_API_URL = `${DOMAIN}/get_categories`;
const POST_CATEGORY_API_URL = `${DOMAIN}/post_category`;
const UPDATE_CATEGORY_API_URL = `${DOMAIN}/update_category`;
const DELETE_CATEGORY_API_URL = `${DOMAIN}/delete_category`;

export {
  GET_TASKS_V2_API_URL,
  POST_TASK_V2_API_URL,
  UPDATE_COMPLETED_TASK_V2_API_URL,
  DELETE_TASK_V2_API_URL,
  UPDATE_TASK_V2_API_URL,
  GET_CATEGORIES_API_URL,
  POST_CATEGORY_API_URL,
  UPDATE_CATEGORY_API_URL,
  DELETE_CATEGORY_API_URL,
};
