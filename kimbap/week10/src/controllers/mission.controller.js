import { StatusCodes } from "http-status-codes";
import { bodyToMission } from "../dtos/mission.dto.js";
import { createMission, challengeMission, listStoreMissions, listMyMissions, completeMyMission } from "../services/mission.service.js";

export const handleCreateMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 생성 API'
    #swagger.tags = ['Missions']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              storeId: { type: "number", example: 1 },
              reward: { type: "number", example: 500 },
              description: { type: "string", example: "첫 방문 인증 시 500P" },
              isActive: { type: "boolean", example: true }
            }
          }
        }
      }
    }
    #swagger.responses[201] = {
      description: '미션 생성 성공 응답',
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              resultType: { type: "string", example: "SUCCESS" },
              error: { type: "object", nullable: true, example: null },
              success: {
                type: "object",
                properties: {
                  missionId: { type: "number" },
                  storeId: { type: "number" },
                  reward: { type: "number" },
                  description: { type: "string" },
                  isActive: { type: "boolean" },
                  createdAt: { type: "string" }
                }
              }
            }
          }
        }
      }
    }
  */
  console.log("미션 생성을 요청했습니다!");
  console.log("body:", req.body);

  try {
    const mission = await createMission(bodyToMission(req.body));
    res.status(StatusCodes.CREATED).success(mission);
  } catch (error) {
    next(error);
  }
};

export const handleChallengeMission = async (req, res, next) => {
  /*
    #swagger.summary = '미션 도전 API'
    #swagger.tags = ['Missions']
    #swagger.parameters['missionId'] = { in: 'path', required: true, schema: { type: 'number' }, example: 3 }
    #swagger.responses[201] = {
      description: '미션 도전 성공 응답',
      content: { "application/json": { schema: { type: 'object', properties: {
        resultType: { type: 'string', example: 'SUCCESS' },
        error: { type: 'object', nullable: true, example: null },
        success: { type: 'object', properties: {
          assignedMissionId: { type: 'number' },
          missionId: { type: 'number' },
          userId: { type: 'number' },
          status: { type: 'string', example: 'assigned' },
          assignedAt: { type: 'string' }
        } }
      } } } }
    }
  */
  console.log("미션 도전을 요청했습니다!");
  console.log("missionId:", req.params.missionId);

  try {
    const userId = Number(req.user.id);
    const missionId = parseInt(req.params.missionId);
    const assignedMission = await challengeMission(missionId, userId);
    res.status(StatusCodes.CREATED).success(assignedMission);
  } catch (error) {
    next(error);
  }
};

export const handleGetStoreMissions = async (req, res, next) => {
  /*
    #swagger.summary = '특정 스토어 미션 목록 조회 API(커서 기반)'
    #swagger.tags = ['Missions']
    #swagger.parameters['storeId'] = { in: 'path', required: true, schema: { type: 'number' }, example: 1 }
    #swagger.parameters['cursor'] = { in: 'query', required: false, schema: { type: 'number' } }
    #swagger.parameters['limit'] = { in: 'query', required: false, schema: { type: 'number', default: 10 } }
    #swagger.parameters['isActive'] = { in: 'query', required: false, schema: { type: 'boolean', default: true } }
    #swagger.responses[200] = {
      description: '스토어 미션 목록 조회 성공 응답',
      content: { "application/json": { schema: { type: 'object', properties: {
        resultType: { type: 'string', example: 'SUCCESS' },
        error: { type: 'object', nullable: true, example: null },
        success: { type: 'object', properties: {
          store: { type: 'object', properties: {
            id: { type: 'number' }, name: { type: 'string' }, category: { type: 'string', nullable: true }, region: { type: 'string', nullable: true }
          } },
          missions: { type: 'array', items: { type: 'object', properties: {
            id: { type: 'number' }, description: { type: 'string' }, reward: { type: 'number' }, isActive: { type: 'boolean' }, createdAt: { type: 'string' }
          } } },
          nextCursor: { type: 'number', nullable: true }
        } }
      } } } }
    }
  */
  console.log("스토어 미션 목록을 요청했습니다!", req.params, req.query);

  try {
    const storeId = req.params.storeId;
    const { cursor, limit, isActive } = req.query;
    const data = await listStoreMissions({ storeId, cursor, limit: limit ? Number(limit) : 10, isActive });
    res.status(StatusCodes.OK).success(data);
  } catch (error) {
    next(error);
  }
};

export const handleGetMyMissions = async (req, res, next) => {
  /*
    #swagger.summary = '내 진행/완료 미션 목록 조회 API'
    #swagger.tags = ['Missions']
    #swagger.parameters['status'] = { in: 'query', required: false, schema: { type: 'string', enum: ['IN_PROGRESS','COMPLETE'] } }
    #swagger.responses[200] = {
      description: '내 미션 목록 조회 성공 응답',
      content: { "application/json": { schema: { type: 'object', properties: {
        resultType: { type: 'string', example: 'SUCCESS' },
        error: { type: 'object', nullable: true, example: null },
        success: { type: 'object', properties: {
          content: { type: 'array', items: { type: 'object', properties: {
            userMissionId: { type: 'number' },
            status: { type: 'string' },
            assignedAt: { type: 'string' },
            completedAt: { type: 'string', nullable: true },
            mission: { type: 'object', properties: { id: { type: 'number' }, description: { type: 'string' }, reward: { type: 'number' } } },
            store: { type: 'object', properties: { id: { type: 'number' }, name: { type: 'string' } } }
          } } }
        } }
      } } } }
    }
  */
  console.log("내 진행/완료 미션 목록을 요청했습니다!", req.query);

  try {
    const userId = Number(req.user.id);
    const { status } = req.query;
    const data = await listMyMissions({ userId, status });
    res.status(StatusCodes.OK).success(data);
  } catch (error) {
    next(error);
  }
};

export const handleCompleteMyMission = async (req, res, next) => {
  /*
    #swagger.summary = '내 미션 완료 처리 API'
    #swagger.tags = ['Missions']
    #swagger.parameters['assignedMissionId'] = { in: 'path', required: true, schema: { type: 'number' }, example: 10 }
    #swagger.responses[200] = {
      description: '미션 완료 성공 응답',
      content: { "application/json": { schema: { type: 'object', properties: {
        resultType: { type: 'string', example: 'SUCCESS' },
        error: { type: 'object', nullable: true, example: null },
        success: { type: 'object', properties: {
          MissionId: { type: 'number' },
          status: { type: 'string', example: 'COMPLETED' },
          assignedAt: { type: 'string' },
          completedAt: { type: 'string' },
          reward: { type: 'number' },
          userPoints: { type: 'number' }
        } }
      } } } }
    }
  */
  console.log("내 미션 완료 처리를 요청했습니다!", req.params);

  try {
    const userId = Number(req.user.id);
    const assignedMissionId = req.params.assignedMissionId;
    const result = await completeMyMission({ userId, assignedMissionId });
    res.status(StatusCodes.OK).success(result);
  } catch (error) {
    next(error);
  }
};
