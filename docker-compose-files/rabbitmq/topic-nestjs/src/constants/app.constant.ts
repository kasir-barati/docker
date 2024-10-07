// Queue naming convention: <owner_name>.<queue_intent>
export const AUDIT_LOG_QUEUE = 'audit_log.logs';
export const USER_WELCOME_MAIL_QUEUE = 'user.send_welcome_email';
export const USER_DEREGISTRATION_MAIL_QUEUE = 'user.send_deregistration_email';

// Routing key convention: <entity_name>.<verb>
export const CREATED_ROUTING_KEY = '*.created';
export const UPDATED_ROUTING_KEY = '*.updated';
export const DELETED_ROUTING_KEY = '*.deleted';
export const USER_CREATED_ROUTING_KEY = 'user.created';
export const USER_DELETED_ROUTING_KEY = 'user.deleted';

// Exchange:
export const TOPIC_EXCHANGE = 'amq.topic';
