"""
Application configuration using Pydantic settings.

Provides centralized configuration for:
- MQTT connection
- database connection
- batch processing parameters
"""
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Environment-based configuration class.
    """
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    mqtt_host: str = "broker"
    mqtt_port: int = 8883
    mqtt_topic: str = "lab/+/+/+"

    db_host: str = "postgres"
    db_name: str = "abcd_db"
    db_user: str = "admin"
    db_password: str = "admin_pass1234"

    batch_size: int = 5


settings = Settings()