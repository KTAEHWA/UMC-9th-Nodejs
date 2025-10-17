import { pool } from "../db.config.js";

// 미션 추가
export const addMission = async (data) => {
  const conn = await pool.getConnection();

  try {
    const [result] = await pool.query(
      `INSERT INTO MissionTemplate (storeId, reward, description, isActive) VALUES (?, ?, ?, ?);`,
      [data.storeId, data.reward, data.description, data.isActive]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 미션 조회
export const getMission = async (missionId) => {
  const conn = await pool.getConnection();

  try {
    const [mission] = await pool.query(
      `SELECT * FROM MissionTemplate WHERE id = ?;`,
      missionId
    );

    if (mission.length === 0) {
      return null;
    }

    return mission[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 가게 존재 여부 검증
export const validateStore = async (storeId) => {
  const conn = await pool.getConnection();

  try {
    const [store] = await pool.query(
      `SELECT id FROM Store WHERE id = ?;`,
      storeId
    );

    return store.length > 0;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 미션 활성화 여부 및 존재 확인
export const validateActiveMission = async (missionId) => {
  const conn = await pool.getConnection();

  try {
    const [mission] = await pool.query(
      `SELECT * FROM MissionTemplate WHERE id = ? AND isActive = 1;`,
      missionId
    );

    if (mission.length === 0) {
      return null;
    }

    return mission[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자가 이미 해당 미션을 도전했는지 확인
export const checkExistingChallenge = async (userId, missionId) => {
  const conn = await pool.getConnection();

  try {
    const [challenge] = await pool.query(
      `SELECT id FROM MissionAssigned WHERE userId = ? AND missionId = ?;`,
      [userId, missionId]
    );

    return challenge.length > 0;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 미션 도전 (MissionAssigned에 추가)
export const assignMission = async (userId, missionId) => {
  const conn = await pool.getConnection();

  try {
    const [result] = await pool.query(
      `INSERT INTO MissionAssigned (userId, missionId, status) VALUES (?, ?, 'assigned');`,
      [userId, missionId]
    );

    return result.insertId;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 할당된 미션 조회
export const getAssignedMission = async (assignedMissionId) => {
  const conn = await pool.getConnection();

  try {
    const [assignedMission] = await pool.query(
      `SELECT * FROM MissionAssigned WHERE id = ?;`,
      assignedMissionId
    );

    if (assignedMission.length === 0) {
      return null;
    }

    return assignedMission[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};
