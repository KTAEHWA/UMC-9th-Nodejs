    import { pool } from "../db.config.js";

    // 리뷰 추가
    export const addReview = async (data) => {
    const conn = await pool.getConnection();

    try {
        const [result] = await pool.query(
        `INSERT INTO Review (assignedMissionId, rating, body) VALUES (?, ?, ?);`,
        [
            data.assignedMissionId, 
            data.rating, 
            data.body]
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

    // 리뷰 정보와 관련 데이터 조회
    export const getReviewWithDetails = async (reviewId) => {
    const conn = await pool.getConnection();

    try {
        const [review] = await pool.query(
        `SELECT r.*, 
                u.id as userId, u.name as userName,
                s.id as storeId, s.storeName,
                mt.id as missionId, mt.description, mt.reward
        FROM Review r
        JOIN MissionAssigned ma ON r.assignedMissionId = ma.id
        JOIN MissionTemplate mt ON ma.missionId = mt.id
        JOIN Store s ON mt.storeId = s.id
        JOIN User u ON ma.userId = u.id
        WHERE r.id = ?;`,
        reviewId
        );

        if (review.length === 0) {
        return null;
        }

        return {
        review: review[0],
        user: {
            id: review[0].userId,
            name: review[0].userName
        },
        store: {
            id: review[0].storeId,
            name: review[0].storeName
        },
        mission: {
            id: review[0].missionId,
            description: review[0].description,
            reward: review[0].reward
        }
        };
    } catch (err) {
        throw new Error(
        `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
        );
    } finally {
        conn.release();
    }
    };

    // 할당된 미션 검증
    export const validateAssignedMission = async (assignedMissionId, userId) => {
    const conn = await pool.getConnection();

    try {
        const [mission] = await pool.query(
        `SELECT ma.*, mt.storeId, s.storeName
        FROM MissionAssigned ma
        JOIN MissionTemplate mt ON ma.missionId = mt.id
        JOIN Store s ON mt.storeId = s.id
        WHERE ma.id = ? AND ma.userId = ? AND ma.status = 'completed';`,
        [assignedMissionId, userId]
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
